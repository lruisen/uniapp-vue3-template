import { ACCESS_TOKEN, CURRENT_USER } from '@/enums/common';
import storage from '@/utils/storage';
import { defineStore } from 'pinia';

interface IUserState {
  info: Recordable;
  token: string;
  isLogined: boolean;
}

export const useUserStore = defineStore('user', {
  // persist: true,
  state: (): IUserState => ({
    info: storage.get(CURRENT_USER) || null,
    token: storage.get(ACCESS_TOKEN) || '',
    isLogined: false,
  }),
  getters: {
    getUserInfo(): Recordable {
      return this.info;
    },
    getToken(): string {
      return this.token;
    },
    getIsLogined(): boolean {
      return this.isLogined;
    },
  },
  actions: {
    setUserInfo(info: Recordable) {
      this.info = info;
    },

    setToken(token: string) {
      this.token = token;
    },

    setIsLogined(isLogined: boolean) {
      this.isLogined = isLogined;
    },
  },
});
