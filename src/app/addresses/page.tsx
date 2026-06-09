// ============================================================
// PAGE — /addresses
// Shows saved delivery addresses
// User can add, edit, delete, set default
// Enhanced with current location detection
// ============================================================

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  Plus,
  Trash2,
  Star,
  Home,
  Briefcase,
  Edit3,
  X,
  Check,
  ChevronLeft,
  Navigation,
  Loader2,
  MapPinned,
  ExternalLink,
} from "lucide-react";
import { useAddresses, type AddressInput } from "@/hooks/useAddresses";
import { useRequireAuth } from "@/hooks/useRequireAuth";

// ── Types ────────────────────────────────────────────────────
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationState {
  loading: boolean;
  error: string | null;
  coords: Coordinates | null;
  address: string | null;
}

// ── Reverse Geocode Helper ───────────────────────────────────
async function reverseGeocode(coords: Coordinates): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );
    const data = await response.json();

    if (data.display_name) {
      return data.display_name;
    }
    return null;
  } catch {
    return null;
  }
}

// ── Location Button Component ────────────────────────────────
function LocationButton({
  onLocationDetected,
}: {
  onLocationDetected: (location: LocationState) => void;
}) {
  const [state, setState] = useState<LocationState>({
    loading: false,
    error: null,
    coords: null,
    address: null,
  });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      const errorState: LocationState = {
        loading: false,
        error: "Geolocation is not supported by your browser",
        coords: null,
        address: null,
      };
      setState(errorState);
      onLocationDetected(errorState);
      return;
    }

    setState({ loading: true, error: null, coords: null, address: null });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Try to get human-readable address
        const address = await reverseGeocode(coords);

        const finalState: LocationState = {
          loading: false,
          error: null,
          coords,
          address,
        };

        setState(finalState);
        onLocationDetected(finalState);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get your location timed out.";
            break;
        }

        const errorState: LocationState = {
          loading: false,
          error: errorMessage,
          coords: null,
          address: null,
        };

        setState(errorState);
        onLocationDetected(errorState);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const clearLocation = () => {
    const clearedState: LocationState = {
      loading: false,
      error: null,
      coords: null,
      address: null,
    };
    setState(clearedState);
    onLocationDetected(clearedState);
  };

  return (
    <div>
      {!state.coords || state.loading ? (
        <button
          type="button"
          onClick={detectLocation}
          disabled={state.loading}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
          style={{
            border: "2px dashed var(--color-brand)",
            color: "var(--color-brand)",
            backgroundColor: "var(--color-brand-50)",
          }}
        >
          {state.loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Detecting your location...
            </>
          ) : (
            <>
              <Navigation size={16} />
              Use Current Location
            </>
          )}
        </button>
      ) : (
        <div className="p-3 rounded-xl bg-green-50 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <MapPinned
                size={16}
                className="text-green-600 mt-0.5 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-green-700">
                  Location Detected
                </p>
                <p className="text-[11px] text-green-600 mt-0.5 break-all line-clamp-2">
                  {state.address ||
                    `${state.coords.latitude.toFixed(
                      6
                    )}, ${state.coords.longitude.toFixed(6)}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearLocation}
              className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full hover:bg-green-200 transition-colors"
            >
              <X size={12} className="text-green-600" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://www.google.com/maps?q=${state.coords.latitude},${state.coords.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:underline"
            >
              <ExternalLink size={11} />
              View on Map
            </a>
            <button
              type="button"
              onClick={detectLocation}
              className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:underline"
            >
              <Navigation size={11} />
              Retry
            </button>
          </div>
        </div>
      )}

      {state.error && !state.coords && (
        <div className="mt-2 p-3 rounded-xl bg-red-50">
          <p className="text-xs text-red-600">{state.error}</p>
        </div>
      )}
    </div>
  );
}

// ── Address Form ──────────────────────────────────────────────
interface AddressFormProps {
  initial?: AddressInput & { id?: string };
  onSubmit: (data: AddressInput) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const LABELS = ["Home", "Work", "Other"];

function AddressForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
}: AddressFormProps) {
  const [form, setForm] = useState<AddressInput>({
    label: initial?.label ?? "Home",
    recipient_name: initial?.recipient_name ?? "",
    phone: initial?.phone ?? "",
    address_line: initial?.address_line ?? "",
    city: initial?.city ?? "Kozhikode",
    pincode: initial?.pincode ?? "",
    is_default: initial?.is_default ?? false,
  });

  const [error, setError] = useState<string | null>(null);

  function update(key: keyof AddressInput, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleLocationDetected(location: LocationState) {
    if (location.address && location.coords) {
      // Auto-fill address with detected location
      update("address_line", location.address);

      // Try to extract pincode from the address
      const pincodeMatch = location.address.match(/\b\d{6}\b/);
      if (pincodeMatch) {
        update("pincode", pincodeMatch[0]);
      }
    } else {
      // Clear address if location was cleared
      update("address_line", "");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.recipient_name.trim()) return setError("Name is required");
    if (!form.phone.trim()) return setError("Phone is required");
    if (!form.address_line.trim()) return setError("Address is required");
    if (!form.pincode.trim()) return setError("Pincode is required");
    await onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Current Location Button */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">Quick Fill</p>
        <LocationButton onLocationDetected={handleLocationDetected} />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">
          or enter manually
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Label selector */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">Address Type</p>
        <div className="flex gap-2">
          {LABELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => update("label", l)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={
                form.label === l
                  ? { backgroundColor: "var(--color-brand)", color: "#fff" }
                  : { backgroundColor: "#f1f5f9", color: "#555" }
              }
            >
              {l === "Home" && <Home size={12} />}
              {l === "Work" && <Briefcase size={12} />}
              {l === "Other" && <MapPin size={12} />}
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      {[
        {
          key: "recipient_name",
          label: "Full Name",
          placeholder: "e.g. Rahul Menon",
          type: "text",
        },
        {
          key: "phone",
          label: "Phone Number",
          placeholder: "e.g. 9876543210",
          type: "tel",
        },
        {
          key: "address_line",
          label: "Full Address",
          placeholder: "House no, Street, Area",
          type: "text",
        },
        {
          key: "pincode",
          label: "Pincode",
          placeholder: "e.g. 673001",
          type: "text",
        },
      ].map(({ key, label, placeholder, type }) => (
        <div key={key}>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
            {label} <span className="text-red-400">*</span>
          </label>
          <input
            type={type}
            value={String(form[key as keyof AddressInput] ?? "")}
            onChange={(e) => update(key as keyof AddressInput, e.target.value)}
            placeholder={placeholder}
            className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
            style={{
              border: "2px solid #e8ecef",
              backgroundColor: "#f8fafc",
              color: "var(--color-navy)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-brand)")}
            onBlur={(e) => (e.target.style.borderColor = "#e8ecef")}
          />
        </div>
      ))}

      {/* City — fixed */}
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
          City
        </label>
        <input
          type="text"
          value="Kozhikode"
          disabled
          className="w-full h-11 px-4 rounded-xl text-sm"
          style={{
            border: "2px solid #e8ecef",
            backgroundColor: "#f1f5f9",
            color: "#888",
          }}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          We currently deliver only within Kozhikode district
        </p>
      </div>

      {/* Set as default */}
      <button
        type="button"
        onClick={() => update("is_default", !form.is_default)}
        className="flex items-center gap-2 text-sm font-semibold"
        style={{ color: form.is_default ? "var(--color-brand)" : "#888" }}
      >
        <div
          className="h-5 w-5 rounded-md flex items-center justify-center transition-all"
          style={{
            backgroundColor: form.is_default ? "var(--color-brand)" : "#e8ecef",
          }}
        >
          {form.is_default && <Check size={12} color="#fff" />}
        </div>
        Set as default address
      </button>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-11 rounded-xl text-sm font-bold transition-all"
          style={{ backgroundColor: "#f1f5f9", color: "#555" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 h-11 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60"
          style={{ backgroundColor: "var(--color-brand)" }}
        >
          {isLoading ? "Saving..." : "Save Address"}
        </button>
      </div>
    </form>
  );
}

// ── Main Content ─────────────────────────────────────────────
function AddressesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? null;

  useRequireAuth();

  const { addresses, isLoading, addAddress, updateAddress, deleteAddress } =
    useAddresses();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleAdd(data: AddressInput) {
    setFormLoading(true);
    setFormError(null);
    const { error } = await addAddress(data);
    setFormLoading(false);
    if (error) {
      setFormError(error);
    } else {
      setShowForm(false);
      // Redirect back if came from checkout
      if (redirectTo) {
        router.push(redirectTo);
      }
    }
  }

  async function handleEdit(id: string, data: AddressInput) {
    setFormLoading(true);
    const { error } = await updateAddress(id, data);
    setFormLoading(false);
    if (!error) setEditingId(null);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteAddress(id);
    setDeletingId(null);
  }

  async function handleSetDefault(id: string) {
    await updateAddress(id, { is_default: true });
  }

  const handleBack = () => {
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.back();
    }
  };

  return (
    <div className="container-app py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleBack}
          className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <ChevronLeft size={18} style={{ color: "var(--color-navy)" }} />
        </button>
        <div>
          <h1
            className="text-xl font-black"
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              color: "var(--color-navy)",
            }}
          >
            Saved Addresses
          </h1>
          <p className="text-xs text-gray-400">
            {redirectTo === "/checkout"
              ? "Add an address to continue checkout"
              : "Manage your delivery addresses"}
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl animate-pulse"
              style={{ backgroundColor: "#e8ecef" }}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && addresses.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: "var(--color-brand-50)" }}
          >
            <MapPin size={28} style={{ color: "var(--color-brand)" }} />
          </div>
          <h2
            className="text-lg font-black mb-1"
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              color: "var(--color-navy)",
            }}
          >
            No addresses yet
          </h2>
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
            {redirectTo === "/checkout"
              ? "Add a delivery address to continue with checkout"
              : "Add a delivery address to make checkout faster"}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold text-white transition-all"
            style={{ backgroundColor: "var(--color-brand)" }}
          >
            <Plus size={16} />
            Add Address
          </button>
        </div>
      )}

      {/* Address list */}
      {!isLoading && addresses.length > 0 && (
        <div className="flex flex-col gap-3 mb-4">
          {addresses.map((addr) => (
            <div key={addr.id}>
              {editingId === addr.id ? (
                <div
                  className="p-4 rounded-2xl"
                  style={{ border: "2px solid var(--color-brand)" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <p
                      className="text-sm font-black"
                      style={{ color: "var(--color-navy)" }}
                    >
                      Edit Address
                    </p>
                    <button onClick={() => setEditingId(null)}>
                      <X size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <AddressForm
                    initial={addr}
                    onSubmit={(data) => handleEdit(addr.id, data)}
                    onCancel={() => setEditingId(null)}
                    isLoading={formLoading}
                  />
                </div>
              ) : (
                <div
                  className="p-4 rounded-2xl bg-white transition-all"
                  style={{
                    border: addr.is_default
                      ? "2px solid var(--color-brand)"
                      : "2px solid #e8ecef",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Icon */}
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          backgroundColor: addr.is_default
                            ? "var(--color-brand)"
                            : "var(--color-brand-50)",
                        }}
                      >
                        {addr.label === "Work" ? (
                          <Briefcase
                            size={15}
                            color={
                              addr.is_default ? "#fff" : "var(--color-brand)"
                            }
                          />
                        ) : (
                          <Home
                            size={15}
                            color={
                              addr.is_default ? "#fff" : "var(--color-brand)"
                            }
                          />
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p
                            className="text-sm font-black"
                            style={{ color: "var(--color-navy)" }}
                          >
                            {addr.label}
                          </p>
                          {addr.is_default && (
                            <span
                              className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white"
                              style={{
                                backgroundColor: "var(--color-brand)",
                              }}
                            >
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-gray-700">
                          {addr.recipient_name} · {addr.phone}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                          {addr.address_line}, {addr.city} — {addr.pincode}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!addr.is_default && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                          title="Set as default"
                        >
                          <Star size={14} className="text-gray-400" />
                        </button>
                      )}
                      <button
                        onClick={() => setEditingId(addr.id)}
                        className="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <Edit3 size={14} className="text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        disabled={deletingId === addr.id}
                        className="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add new form */}
      {showForm && (
        <div
          className="p-4 rounded-2xl bg-white mb-4"
          style={{ border: "2px solid var(--color-brand)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p
              className="text-sm font-black"
              style={{ color: "var(--color-navy)" }}
            >
              New Address
            </p>
            <button
              onClick={() => {
                setShowForm(false);
                setFormError(null);
              }}
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 mb-3">
              <p className="text-xs text-red-600 font-medium">{formError}</p>
            </div>
          )}
          <AddressForm
            onSubmit={handleAdd}
            onCancel={() => {
              setShowForm(false);
              setFormError(null);
            }}
            isLoading={formLoading}
          />
        </div>
      )}

      {/* Add button — when addresses exist */}
      {!isLoading && addresses.length > 0 && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-bold transition-all"
          style={{
            border: "2px dashed var(--color-brand)",
            color: "var(--color-brand)",
            backgroundColor: "var(--color-brand-50)",
          }}
        >
          <Plus size={16} />
          Add New Address
        </button>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function AddressesPage() {
  return (
    <Suspense fallback={null}>
      <AddressesContent />
    </Suspense>
  );
}
