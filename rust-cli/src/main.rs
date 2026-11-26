use clap::{Parser, Subcommand};
use regex::Regex;
use serde::Deserialize;
use std::collections::{HashSet, VecDeque};
use std::fs;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

#[derive(Parser)]
#[command(name = "zerolight", version = "0.1.0", about = "ZeroLight Design System Native Rust CLI")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// List available ZeroLight components and blocks
    List {
        #[arg(long, env = "ZEROLIGHT_REGISTRY_URL", default_value = "https://bricks.zerorapid.in/registry")]
        registry: String,
        #[arg(long, env = "ZERORAPID_REGISTRY_TOKEN")]
        token: Option<String>,
    },
    /// Install components or B2B blocks (e.g. button, block/billing-portal)
    Add {
        items: Vec<String>,
        #[arg(long, short, default_value = ".")]
        out: PathBuf,
        #[arg(long, env = "ZEROLIGHT_REGISTRY_URL", default_value = "https://bricks.zerorapid.in/registry")]
        registry: String,
        #[arg(long, env = "ZERORAPID_REGISTRY_TOKEN")]
        token: Option<String>,
    },
    /// Audit TSX files for ZeroLight token invariants (hardcoded hex colors, etc.)
    Check {
        #[arg(default_value = "./src")]
        target: PathBuf,
    },
    /// Compare a local component against the upstream ZeroLight registry
    Diff {
        item: String,
        #[arg(long, default_value = ".")]
        out: PathBuf,
        #[arg(long, env = "ZEROLIGHT_REGISTRY_URL", default_value = "https://bricks.zerorapid.in/registry")]
        registry: String,
        #[arg(long, env = "ZERORAPID_REGISTRY_TOKEN")]
        token: Option<String>,
    },
}

#[derive(Deserialize)]
struct RegistryIndex {
    items: Vec<RegistryMeta>,
}

#[derive(Deserialize)]
struct RegistryMeta {
    name: String,
    #[serde(rename = "type")]
    kind: Option<String>,
}

#[derive(Deserialize)]
struct RegistryItem {
    #[serde(default, rename = "registryDependencies")]
    registry_dependencies: Vec<String>,
    #[serde(default)]
    files: Vec<RegistryFile>,
}

#[derive(Deserialize)]
struct RegistryFile {
    path: String,
    content: String,
}

fn fetch_json<T: for<'de> Deserialize<'de>>(url: &str, token: Option<&str>) -> Result<T, String> {
    let mut req = ureq::get(url);
    if let Some(t) = token {
        req = req.set("x-zerolight-token", t);
    }
    let resp = req.call().map_err(|e| format!("HTTP error for {url}: {e}"))?;
    resp.into_json::<T>().map_err(|e| format!("JSON parse error for {url}: {e}"))
}

fn resolve_alias(name: &str) -> &str {
    name.strip_prefix("block/").unwrap_or(name)
}

fn load_item(name: &str, registry: &str, token: Option<&str>) -> Result<RegistryItem, String> {
    let local = Path::new("public/registry").join(format!("{name}.json"));
    if local.exists() {
        let raw = fs::read_to_string(&local).map_err(|e| e.to_string())?;
        return serde_json::from_str(&raw).map_err(|e| e.to_string());
    }
    fetch_json(&format!("{}/{name}.json", registry.trim_end_matches('/')), token)
}

fn cmd_list(registry: &str, token: Option<&str>) -> Result<(), String> {
    let local = Path::new("public/registry/index.json");
    let index: RegistryIndex = if local.exists() {
        let raw = fs::read_to_string(local).map_err(|e| e.to_string())?;
        serde_json::from_str(&raw).map_err(|e| e.to_string())?
    } else {
        fetch_json(&format!("{}/index.json", registry.trim_end_matches('/')), token)?
    };
    println!("ZeroLight Registry ({} items):", index.items.len());
    for item in index.items {
        println!("  - {} [{}]", item.name, item.kind.unwrap_or_else(|| "component".into()));
    }
    Ok(())
}

fn cmd_add(items: Vec<String>, out: &Path, registry: &str, token: Option<&str>) -> Result<(), String> {
    let mut queue: VecDeque<String> = items.into_iter().map(|s| resolve_alias(&s).to_string()).collect();
    let mut visited = HashSet::new();
    while let Some(name) = queue.pop_front() {
        if !visited.insert(name.clone()) {
            continue;
        }
        let item = load_item(&name, registry, token)?;
        for dep in item.registry_dependencies {
            let dep_name = dep.strip_prefix("@zerolight/").unwrap_or(&dep).trim_end_matches(".json").to_string();
            if !visited.contains(&dep_name) {
                queue.push_back(dep_name);
            }
        }
        for file in item.files {
            let dest = out.join(&file.path);
            if let Some(parent) = dest.parent() {
                fs::create_dir_all(parent).map_err(|e| e.to_string())?;
            }
            fs::write(&dest, &file.content).map_err(|e| e.to_string())?;
            println!("  + {}", dest.display());
        }
    }
    Ok(())
}

fn cmd_check(target: &Path) -> Result<(), String> {
    let hex_re = Regex::new(r"#[0-9a-fA-F]{6}\b").map_err(|e| e.to_string())?;
    let mut violations = 0usize;
    let mut scanned = 0usize;
    for entry in WalkDir::new(target).into_iter().filter_map(Result::ok) {
        let p = entry.path();
        if p.extension().and_then(|s| s.to_str()) != Some("tsx") {
            continue;
        }
        let p_str = p.to_string_lossy();
        if p_str.contains("context.tsx") || p_str.contains("types.ts") || p_str.contains("libraries/") {
            continue;
        }
        scanned += 1;
        if let Ok(content) = fs::read_to_string(p) {
            for (idx, line) in content.lines().enumerate() {
                if line.contains("tokens.") || line.trim_start().starts_with("//") {
                    continue;
                }
                if let Some(m) = hex_re.find(line) {
                    println!("WARN {}:{} hardcoded hex {}", p.display(), idx + 1, m.as_str());
                    violations += 1;
                }
            }
        }
    }
    println!("Scanned {scanned} TSX files -> {violations} token invariant warnings.");
    Ok(())
}

fn cmd_diff(item_name: &str, out: &Path, registry: &str, token: Option<&str>) -> Result<(), String> {
    let resolved = resolve_alias(item_name);
    let item = load_item(resolved, registry, token)?;
    for file in item.files {
        let local_path = out.join(&file.path);
        if !local_path.exists() {
            println!("MISSING {} (not installed locally)", file.path);
            continue;
        }
        let local_content = fs::read_to_string(&local_path).map_err(|e| e.to_string())?;
        if local_content == file.content {
            println!("SYNCED  {}", file.path);
        } else {
            println!("MODIFIED {} (differs from upstream)", file.path);
        }
    }
    Ok(())
}

fn main() {
    let cli = Cli::parse();
    let res = match cli.command {
        Commands::List { registry, token } => cmd_list(&registry, token.as_deref()),
        Commands::Add { items, out, registry, token } => cmd_add(items, &out, &registry, token.as_deref()),
        Commands::Check { target } => cmd_check(&target),
        Commands::Diff { item, out, registry, token } => cmd_diff(&item, &out, &registry, token.as_deref()),
    };
    if let Err(err) = res {
        eprintln!("Error: {err}");
        std::process::exit(1);
    }
}
