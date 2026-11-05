import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import {
  Building2,
  Hash,
  MapPin,
  User,
  Mail,
  Phone,
  Printer,
  FileText,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { BuyerRecord, BUYER_COUNTRIES } from './data/buyersData';

interface AddBuyerModalProps {
  isOpen: boolean;
  initialData?: BuyerRecord | null;
  onSave: (buyer: Omit<BuyerRecord, 'id'>, id?: number) => void;
  onClose: () => void;
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

export const AddBuyerFormCard: React.FC<AddBuyerModalProps> = ({
  isOpen,
  initialData,
  onSave,
  onClose,
  onShowToast,
}) => {
  const isEditing = !!initialData;
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    buyerName: initialData?.buyerName || '',
    buyerCode: initialData?.buyerCode || '',
    buyerCountry: initialData?.buyerCountry || '',
    buyerAddress: initialData?.buyerAddress || '',
    emailId: initialData?.emailId || '',
    contactPerson: initialData?.contactPerson || '',
    contactNumber: initialData?.contactNumber || '',
    faxNumber: initialData?.faxNumber || '',
    irsNumber: initialData?.irsNumber || '',
    usciCode: initialData?.usciCode || '',
    iftpCode: initialData?.iftpCode || '',
    stateForUsa: initialData?.stateForUsa || '',
    zipcodeForUsa: initialData?.zipcodeForUsa || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        buyerName: initialData.buyerName || '',
        buyerCode: initialData.buyerCode || '',
        buyerCountry: initialData.buyerCountry || '',
        buyerAddress: initialData.buyerAddress || '',
        emailId: initialData.emailId || '',
        contactPerson: initialData.contactPerson || '',
        contactNumber: initialData.contactNumber || '',
        faxNumber: initialData.faxNumber || '',
        irsNumber: initialData.irsNumber || '',
        usciCode: initialData.usciCode || '',
        iftpCode: initialData.iftpCode || '',
        stateForUsa: initialData.stateForUsa || '',
        zipcodeForUsa: initialData.zipcodeForUsa || '',
      });
    } else {
      setFormData({
        buyerName: '',
        buyerCode: '',
        buyerCountry: '',
        buyerAddress: '',
        emailId: '',
        contactPerson: '',
        contactNumber: '',
        faxNumber: '',
        irsNumber: '',
        usciCode: '',
        iftpCode: '',
        stateForUsa: '',
        zipcodeForUsa: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.buyerName.trim()) {
      newErrors.buyerName = 'Buyer Name is required';
    }
    if (!formData.buyerCountry) {
      newErrors.buyerCountry = 'Buyer Country is required';
    }
    if (!formData.buyerAddress.trim()) {
      newErrors.buyerAddress = 'Buyer Address is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      onShowToast?.('Please provide all mandatory fields (*)', 'error');
      return;
    }

    onSave(
      {
        buyerName: formData.buyerName.trim(),
        buyerCode: formData.buyerCode.trim(),
        buyerCountry: formData.buyerCountry,
        buyerAddress: formData.buyerAddress.trim(),
        emailId: formData.emailId.trim(),
        contactPerson: formData.contactPerson.trim(),
        contactNumber: formData.contactNumber.trim(),
        faxNumber: formData.faxNumber.trim(),
        irsNumber: formData.irsNumber.trim(),
        usciCode: formData.usciCode.trim(),
        iftpCode: formData.iftpCode.trim(),
        stateForUsa: formData.stateForUsa.trim(),
        zipcodeForUsa: formData.zipcodeForUsa.trim(),
        status: 'ACTIVE',
      },
      initialData?.id
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0B0F19]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-3xl bg-white rounded-2xl border border-border-subtle shadow-[0_20px_60px_rgba(0,0,0,0.25)] flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* 1. Modal Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border-subtle/80 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#101828] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-content-main tracking-tight">
                {isEditing ? `Edit Buyer: ${formData.buyerName || 'Details'}` : 'New Buyer Registration'}
              </h2>
              <p className="text-xs text-content-muted">
                Configure international seafood purchasing entity and customs codes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full border border-border-subtle hover:bg-slate-100 flex items-center justify-center text-content-muted hover:text-content-main transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* 2. Modal Body (Scrollable Form) */}
        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden flex-1">
          <div className="overflow-y-auto p-5 sm:p-6 flex flex-col gap-6 no-scrollbar">
            {/* Section 1: Entity Profile */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-content-main">
                <Building2 className="w-3.5 h-3.5 text-[#00a7bc]" />
                <span>Buyer Entity Profile</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Buyer Name */}
                <div className="flex flex-col gap-1.5 md:col-span-1">
                  <label className="text-xs font-semibold text-content-main">
                    Buyer Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Pacific Seafood LLC"
                    value={formData.buyerName}
                    onChange={(e) => handleChange('buyerName', e.target.value)}
                    startIcon={<Building2 className="w-4 h-4" />}
                    inputSize="md"
                    radius="pill"
                    isError={!!errors.buyerName}
                  />
                  {errors.buyerName && (
                    <span className="text-[11px] font-medium text-rose-500">{errors.buyerName}</span>
                  )}
                </div>

                {/* Buyer Code */}
                <div className="flex flex-col gap-1.5 md:col-span-1">
                  <label className="text-xs font-semibold text-content-main">
                    Buyer Code <span className="text-content-tertiary text-[11px]">(Optional)</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. PAC-US-01"
                    value={formData.buyerCode}
                    onChange={(e) => handleChange('buyerCode', e.target.value)}
                    startIcon={<Hash className="w-4 h-4" />}
                    inputSize="md"
                    radius="pill"
                  />
                </div>

                {/* Buyer Country */}
                <div className="flex flex-col gap-1.5 md:col-span-1">
                  <label className="text-xs font-semibold text-content-main">
                    Buyer Country <span className="text-rose-500">*</span>
                  </label>
                  <SearchableSelect
                    options={BUYER_COUNTRIES}
                    value={formData.buyerCountry}
                    onChange={(val) => handleChange('buyerCountry', val)}
                    placeholder="Select Country..."
                    searchPlaceholder="Filter country..."
                    hasError={!!errors.buyerCountry}
                  />
                  {errors.buyerCountry && (
                    <span className="text-[11px] font-medium text-rose-500">{errors.buyerCountry}</span>
                  )}
                </div>
              </div>

              {/* Buyer Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-content-main">
                  Buyer Address <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 16797 SE 130th Ave, Clackamas, OR 97015"
                  value={formData.buyerAddress}
                  onChange={(e) => handleChange('buyerAddress', e.target.value)}
                  startIcon={<MapPin className="w-4 h-4" />}
                  inputSize="md"
                  radius="pill"
                  isError={!!errors.buyerAddress}
                />
                {errors.buyerAddress && (
                  <span className="text-[11px] font-medium text-rose-500">{errors.buyerAddress}</span>
                )}
              </div>
            </div>

            {/* Section 2: Contact & Correspondence */}
            <div className="flex flex-col gap-3.5 pt-3.5 border-t border-border-subtle/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-content-main">
                <Mail className="w-3.5 h-3.5 text-[#00a7bc]" />
                <span>Contact & Correspondence</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                {/* Contact Person */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-content-main">Contact Person</label>
                  <Input
                    type="text"
                    placeholder="e.g. John Miller"
                    value={formData.contactPerson}
                    onChange={(e) => handleChange('contactPerson', e.target.value)}
                    startIcon={<User className="w-4 h-4" />}
                    inputSize="md"
                    radius="pill"
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-content-main">Email Address</label>
                  <Input
                    type="email"
                    placeholder="e.g. import@pacseafood.com"
                    value={formData.emailId}
                    onChange={(e) => handleChange('emailId', e.target.value)}
                    startIcon={<Mail className="w-4 h-4" />}
                    inputSize="md"
                    radius="pill"
                  />
                </div>

                {/* Contact Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-content-main">Phone Number</label>
                  <Input
                    type="text"
                    placeholder="e.g. +1 (503) 555-0192"
                    value={formData.contactNumber}
                    onChange={(e) => handleChange('contactNumber', e.target.value)}
                    startIcon={<Phone className="w-4 h-4" />}
                    inputSize="md"
                    radius="pill"
                  />
                </div>

                {/* Fax Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-content-main">Fax Number</label>
                  <Input
                    type="text"
                    placeholder="e.g. +1 (503) 555-0199"
                    value={formData.faxNumber}
                    onChange={(e) => handleChange('faxNumber', e.target.value)}
                    startIcon={<Printer className="w-4 h-4" />}
                    inputSize="md"
                    radius="pill"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Regulatory & Customs Identifiers */}
            <div className="flex flex-col gap-3.5 pt-3.5 border-t border-border-subtle/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-content-main">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00a7bc]" />
                <span>Customs, Tax & Regulatory Identification</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {/* IRS Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-content-main">IRS Number</label>
                  <Input
                    type="text"
                    placeholder="e.g. 93-0849201"
                    value={formData.irsNumber}
                    onChange={(e) => handleChange('irsNumber', e.target.value)}
                    startIcon={<FileText className="w-4 h-4" />}
                    inputSize="md"
                    radius="pill"
                  />
                </div>

                {/* USCI Code */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-content-main">USCI Code</label>
                  <Input
                    type="text"
                    placeholder="e.g. 91330900MA28T492XX"
                    value={formData.usciCode}
                    onChange={(e) => handleChange('usciCode', e.target.value)}
                    startIcon={<FileText className="w-4 h-4" />}
                    inputSize="md"
                    radius="pill"
                  />
                </div>

                {/* IFTP Code */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-content-main">IFTP Code</label>
                  <Input
                    type="text"
                    placeholder="e.g. IFTP-2026-US-8921"
                    value={formData.iftpCode}
                    onChange={(e) => handleChange('iftpCode', e.target.value)}
                    startIcon={<FileText className="w-4 h-4" />}
                    inputSize="md"
                    radius="pill"
                  />
                </div>

                {/* State (For USA) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-content-main">State (USA)</label>
                  <Input
                    type="text"
                    placeholder="e.g. Oregon"
                    value={formData.stateForUsa}
                    onChange={(e) => handleChange('stateForUsa', e.target.value)}
                    startIcon={<MapPin className="w-4 h-4" />}
                    inputSize="md"
                    radius="pill"
                  />
                </div>

                {/* Zipcode (For USA) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-content-main">Zipcode (USA)</label>
                  <Input
                    type="text"
                    placeholder="e.g. 97015"
                    value={formData.zipcodeForUsa}
                    onChange={(e) => handleChange('zipcodeForUsa', e.target.value)}
                    startIcon={<Hash className="w-4 h-4" />}
                    inputSize="md"
                    radius="pill"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Modal Actions Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-subtle/80 bg-slate-50/80 rounded-b-2xl shrink-0">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="black"
              type="submit"
              icon={<Check className="w-4 h-4 stroke-[2.2]" />}
            >
              {isEditing ? 'Save Changes' : 'Register Buyer Record'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AddBuyerModal = AddBuyerFormCard;
