import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  className?: string;
}

export const Silk: React.FC<SilkProps> = ({
  speed = 1.0,
  scale = 1.0,
  color = '#00a7bc',
  noiseIntensity = 1.2,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl', { antialias: true, alpha: false }) ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

    if (!gl) {
      console.warn('WebGL not supported for Silk component');
      return;
    }

    // Helper: Parse hex color to normalized RGB
    const hexToRgb = (hex: string): [number, number, number] => {
      let clean = hex.replace('#', '').trim();
      if (clean.length === 3) {
        clean = clean
          .split('')
          .map((c) => c + c)
          .join('');
      }
      const num = parseInt(clean, 16);
      if (isNaN(num)) return [0.0, 0.65, 0.74]; // Default telemetry teal
      return [
        ((num >> 16) & 255) / 255,
        ((num >> 8) & 255) / 255,
        (num & 255) / 255,
      ];
    };

    const rgbColor = hexToRgb(color);

    // Shaders
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec3 u_color;
      uniform float u_speed;
      uniform float u_scale;
      uniform float u_noiseIntensity;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float amp = 0.5;
        mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
        for (int i = 0; i < 5; i++) {
          v += amp * noise(p);
          p = rot * p * 2.0;
          amp *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        p *= (2.4 * u_scale);

        float t = u_time * 0.14 * u_speed;

        // Interactive cursor warp
        vec2 m = (u_mouse - 0.5) * 1.5;
        p += m * 0.2;

        // Domain warping for satin folds
        vec2 q = vec2(fbm(p + vec2(0.0, t * 0.8)), fbm(p + vec2(5.2, 1.3) - vec2(t * 0.4, 0.0)));
        vec2 r = vec2(fbm(p + 1.5 * q + vec2(1.7, 9.2) + vec2(0.0, t * 0.6)), fbm(p + 1.5 * q + vec2(8.3, 2.8)));

        float f = fbm(p + 1.8 * r * u_noiseIntensity);

        // Sinusoidal wave sheen simulating light on physical woven silk threads
        float wave = sin(p.x * 3.2 + q.x * 3.5 + sin(t + r.y * 2.8));
        f = mix(f, wave, 0.35);

        // Pure dark black base with subtle monochrome satin sheen
        vec3 deepBase = vec3(0.008, 0.008, 0.012);
        vec3 silkAccent = u_color;
        vec3 sheen = vec3(0.36, 0.38, 0.42);

        vec3 col = mix(deepBase, silkAccent, clamp(f * 1.5, 0.0, 1.0));
        col = mix(col, sheen, clamp(pow(max(0.0, wave), 3.2) * 0.4, 0.0, 1.0));
        col += vec3(pow(abs(wave), 4.8) * 0.18);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Silk Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Silk Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry (full-screen triangle fan)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uColor = gl.getUniformLocation(program, 'u_color');
    const uSpeed = gl.getUniformLocation(program, 'u_speed');
    const uScale = gl.getUniformLocation(program, 'u_scale');
    const uNoiseIntensity = gl.getUniformLocation(program, 'u_noiseIntensity');

    gl.uniform3f(uColor, rgbColor[0], rgbColor[1], rgbColor[2]);
    gl.uniform1f(uSpeed, speed);
    gl.uniform1f(uScale, scale);
    gl.uniform1f(uNoiseIntensity, noiseIntensity);

    // Mouse coordinates tracking with smooth interpolation
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const handlePointerMove = (e: PointerEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - e.clientY / window.innerHeight;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Handle Resize
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth * dpr;
      const height = canvas.clientHeight * dpr;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(uResolution, width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    // Animation Loop
    let animationFrameId: number;
    let startTime = performance.now();

    const render = () => {
      const currentTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      gl.uniform1f(uTime, currentTime);
      gl.uniform2f(uMouse, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [speed, scale, color, noiseIntensity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full block select-none pointer-events-none', className)}
    />
  );
};

export default Silk;
