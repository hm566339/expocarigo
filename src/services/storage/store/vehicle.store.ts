import { create } from "zustand";
import VehicleService from "../../api/vehicle.service";

/* ================= TYPES ================= */

export interface VehicleLocation {
  city: string;
  latitude: number;
  longitude: number;
  address?: string;
  state?: string;
  pincode?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  pricePerDay: number;
  location?: VehicleLocation;
  images?: string[];

  ownerName?: string;
  ratePerHour?: number;
  billingMode?: string;
  kycStatus?: string;

  availability?: boolean; // ✅ ADD THIS
}

export interface VehicleFilters {
  city?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
}

export interface VehicleStore {
  // State
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  filters: VehicleFilters;

  // Actions
  fetchVehicles: (filters: VehicleFilters) => Promise<void>;
  searchVehicles: (keyword: string) => Promise<void>;
  getAllVehicles: (page?: number, size?: number) => Promise<void>;
  getVehicleById: (vehicleId: string) => Promise<Vehicle | null>;
  setFilters: (filters: VehicleFilters) => void;
  clearVehicles: () => void;
  clearError: () => void;
}

/* ================= STORE ================= */

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: [],
  isLoading: false,
  error: null,
  filters: {},

  /* =========================================================
     FETCH VEHICLES BY CITY (SEARCH)
  ========================================================= */
  fetchVehicles: async (filters: VehicleFilters) => {
    set({ isLoading: true, error: null });

    try {
      const keyword = filters.city || filters.keyword || "";

      if (!keyword) {
        set({
          vehicles: [],
          isLoading: false,
          error: "Please provide a city or keyword to search",
        });
        return;
      }

      // ✅ REAL API CALL
      const response = await VehicleService.searchVehicles(keyword);

      // Optional: response mapping (if backend structure different)
      const vehicles: Vehicle[] = (response || []).map((v: any) => {
        console.log("🔍 RAW VEHICLE:", v);
        console.log(
          "🔍 ratePerDay value:",
          v.ratePerDay,
          "type:",
          typeof v.ratePerDay,
        );

        const price =
          v.ratePerDay !== undefined && v.ratePerDay !== null
            ? Number(v.ratePerDay)
            : v.rate_per_day !== undefined && v.rate_per_day !== null
              ? Number(v.rate_per_day)
              : v.pricePerDay !== undefined && v.pricePerDay !== null
                ? Number(v.pricePerDay)
                : 0;

        console.log("✅ Final pricePerDay:", price);

        return {
          id: String(v.vehicleId ?? v.id ?? ""), // safer
          name: v.vehicleNumber ?? v.name ?? "Unknown Vehicle",

          // ✅ GUARANTEED FIX
          pricePerDay: price,

          location: v.location
            ? {
                city: v.location.city ?? "",
                latitude: Number(v.location.latitude ?? 0),
                longitude: Number(v.location.longitude ?? 0),
                address: v.location.address,
                state: v.location.state,
                pincode: v.location.postalCode,
              }
            : undefined,

          images: v.vehicleImageUrls ?? v.images ?? [],

          ownerName: v.ownerName,
          ratePerHour:
            v.ratePerHour !== undefined ? Number(v.ratePerHour) : undefined,

          billingMode: v.billingMode,
          kycStatus: v.kycStatus,
        };
      });

      set({
        vehicles,
        filters,
        isLoading: false,
        error: null,
      });

      console.log("[v0] ✅ Vehicles fetched:", vehicles.length);
    } catch (error: any) {
      console.error("[v0] ❌ Error fetching vehicles:", error);

      set({
        vehicles: [],
        isLoading: false,
        error: error?.message || "Failed to fetch vehicles",
      });
    }
  },

  /* =========================================================
     SEARCH VEHICLES BY KEYWORD
  ========================================================= */
  searchVehicles: async (keyword: string) => {
    set({ isLoading: true, error: null });

    try {
      if (!keyword.trim()) {
        set({
          vehicles: [],
          isLoading: false,
          error: "Please enter a search keyword",
        });
        return;
      }

      const response = await VehicleService.searchVehicles(keyword);

      const vehicles: Vehicle[] = (response || []).map((v: any) => ({
        id: String(v.id),
        name: v.name || v.vehicleName,
        pricePerDay: Number(v.pricePerDay || v.price || 0),
        location: v.location,
        images: v.images || [],
        availability: v.availability !== false,
      }));

      set({
        vehicles,
        filters: { keyword },
        isLoading: false,
      });

      console.log("[v0] ✅ Search completed:", vehicles.length);
    } catch (error: any) {
      console.error("[v0] ❌ Search error:", error);
      set({
        error: error?.message || "Search failed",
        isLoading: false,
      });
    }
  },

  /* =========================================================
     GET ALL VEHICLES (PAGINATED)
  ========================================================= */
  getAllVehicles: async (page = 0, size = 20) => {
    set({ isLoading: true, error: null });

    try {
      const response = await VehicleService.getAllVehicles(page, size);

      const vehicles: Vehicle[] = (response || []).map((v: any) => ({
        id: String(v.id),
        name: v.name || v.vehicleName,
        pricePerDay: Number(v.pricePerDay || v.price || 0),
        location: v.location,
        images: v.images || [],
        availability: v.availability !== false,
      }));

      set({
        vehicles,
        isLoading: false,
      });

      console.log("[v0] ✅ All vehicles fetched:", vehicles.length);
    } catch (error: any) {
      console.error("[v0] ❌ Error fetching all vehicles:", error);
      set({
        error: error?.message || "Failed to fetch vehicles",
        isLoading: false,
      });
    }
  },

  /* =========================================================
     GET VEHICLE BY ID
  ========================================================= */
  getVehicleById: async (vehicleId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await VehicleService.getVehicle(vehicleId);

      const vehicle: Vehicle = {
        id: String(response.id),
        name: response.name || response.vehicleName,
        pricePerDay: Number(response.pricePerDay || response.price || 0),
        location: response.location,
        images: response.images || [],
        availability: response.availability !== false,
        description: response.description,
      };

      set({ isLoading: false });
      console.log("[v0] ✅ Vehicle fetched:", vehicle);
      return vehicle;
    } catch (error: any) {
      console.error("[v0] ❌ Error fetching vehicle:", error);
      set({
        error: error?.message || "Failed to fetch vehicle",
        isLoading: false,
      });
      return null;
    }
  },

  /* =========================================================
     SET FILTERS
  ========================================================= */
  setFilters: (filters: VehicleFilters) => {
    set({ filters });
  },

  /* =========================================================
     CLEAR VEHICLES
  ========================================================= */
  clearVehicles: () => {
    set({ vehicles: [], error: null });
  },

  /* =========================================================
     CLEAR ERROR
  ========================================================= */
  clearError: () => {
    set({ error: null });
  },
}));
