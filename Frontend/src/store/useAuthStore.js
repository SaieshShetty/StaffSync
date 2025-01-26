import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  employees: [],
  assignments: [],
  isAssigning: false,
  isFetchingAssignments: false,
  isSigningUp: false,
  isAssigning: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // Check Authentication (Existing)
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup (Existing)
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login (Existing)
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout (Existing)
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Update Profile (Existing)
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Socket Connection (Existing)
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  fetchEmployees: async () => {
    try {
      const res = await axiosInstance.get("/auth/employees");
      set({ employees: res.data });
    } catch (error) {
      toast.error("Failed to fetch employees");
    }
  },

  assignWork: async (assignmentData) => {
    set({ isAssigning: true });
    try {
      const res = await axiosInstance.post("/auth/assign-work", assignmentData);

      set((state) => ({
        assignments: [...state.assignments, res.data.assignment],
      }));

      toast.success("Assignment created successfully");
      return res.data.assignment;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign work");
      throw error;
    } finally {
      set({ isAssigning: false });
    }
  },

  fetchEmployeeAssignments: async (employeeId) => {
    if (!employeeId) {
      console.error("Employee ID is undefined");
      return;
    }
    set({ isFetchingAssignments: true });
    try {
      const res = await axiosInstance.get(`/auth/assignments/${employeeId}`);
      set({ assignments: res.data });
    } catch (error) {
      toast.error("Failed to fetch assignments");
    } finally {
      set({ isFetchingAssignments: false });
    }
  },
  
  updateAssignmentStatus: async (assignmentId, status) => {
    try {
      const res = await axiosInstance.patch(`/auth/assignments/${assignmentId}/status`, { status });
      
      set((state) => ({
        assignments: state.assignments.map(assignment => 
          assignment._id === assignmentId 
            ? { ...assignment, status } 
            : assignment
        )
      }));
  
      toast.success(`Assignment marked as ${status}`);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update assignment status");
      throw error;
    }
  },

  // Socket Disconnect (Existing)
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
