import { defineStore } from "pinia";
import { getUserProfile, updateUserProfile } from "@/services/userService";
import { useAuthStore } from "@/stores/auth";

export const useUserStore = defineStore("user", {
  state: () => ({
    profile: null,
  }),

  actions: {
    async fetchProfile() {
      const auth = useAuthStore();
      const id = auth.user?.id;

      console.log("📣 fetchProfile() usando ID:", id);

      if (!id) throw new Error("No hay usuario autenticado");

      this.profile = await getUserProfile(id);
    },

    async updateProfile(data) {
      const auth = useAuthStore();
      const id = auth.user?.id;

      try {
        const updated = await updateUserProfile(id, data);
        this.profile = updated;
        
        // También actualizar el nombre en auth store si es necesario
        if (data.name) {
          auth.user.name = data.name;
        }
        
        return updated;
      } catch (error) {
        console.error("Error en store al actualizar perfil:", error);
        throw error; // Re-lanzar el error para manejarlo en el componente
      }
    }
  }
});
