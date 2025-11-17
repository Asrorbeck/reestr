import type { Integration, IntegrationTab } from "./types";

const INTEGRATIONS_KEY = "integrations_data";

export const localStorageUtils = {
  // Ma'lumotlarni LocalStorage'ga saqlash
  saveIntegrations: (integrations: Integration[]): void => {
    try {
      localStorage.setItem(INTEGRATIONS_KEY, JSON.stringify(integrations));
    } catch (error) {
      console.error("LocalStorage'ga saqlashda xatolik:", error);
    }
  },

  // Ma'lumotlarni LocalStorage'dan o'qish
  getIntegrations: (): Integration[] => {
    try {
      const data = localStorage.getItem(INTEGRATIONS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error("LocalStorage'dan o'qishda xatolik:", error);
      return [];
    }
  },

  // Yangi integratsiya qo'shish
  addIntegration: (
    integration: Omit<
      Integration,
      "id" | "createdAt" | "updatedAt" | "dynamicTabs"
    > & {
      dynamicTabs?: Array<{
        name: string;
        columnKey: string;
        title: string;
        description: string;
        files: Array<{
          name: string;
          size: number;
          type: string;
        }>;
      }>;
    }
  ): Integration => {
    const existingIntegrations = localStorageUtils.getIntegrations();

    // Dynamic tablarni to'g'ri formatda yaratish
    const processedDynamicTabs =
      integration.dynamicTabs?.map((tab) => ({
        ...tab,
        id: `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })) || [];

    const newIntegration: Integration = {
      ...integration,
      dynamicTabs: processedDynamicTabs,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedIntegrations = [newIntegration, ...existingIntegrations];
    localStorageUtils.saveIntegrations(updatedIntegrations);
    return newIntegration;
  },

  // Integratsiyani yangilash
  updateIntegration: (
    id: string,
    updates: Partial<Integration>
  ): Integration | null => {
    const existingIntegrations = localStorageUtils.getIntegrations();
    const integrationIndex = existingIntegrations.findIndex(
      (integration) => integration.id === id
    );

    if (integrationIndex === -1) {
      return null;
    }

    const updatedIntegration: Integration = {
      ...existingIntegrations[integrationIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    existingIntegrations[integrationIndex] = updatedIntegration;
    localStorageUtils.saveIntegrations(existingIntegrations);
    return updatedIntegration;
  },

  // Integratsiyani o'chirish
  deleteIntegration: (id: string): boolean => {
    const existingIntegrations = localStorageUtils.getIntegrations();
    const filteredIntegrations = existingIntegrations.filter(
      (integration) => integration.id !== id
    );

    if (filteredIntegrations.length === existingIntegrations.length) {
      return false; // Integratsiya topilmadi
    }

    localStorageUtils.saveIntegrations(filteredIntegrations);
    return true;
  },

  // LocalStorage'ni tozalash
  clearIntegrations: (): void => {
    localStorage.removeItem(INTEGRATIONS_KEY);
  },

  // Mock ma'lumotlarni LocalStorage'ga yuklash
  loadMockData: (mockIntegrations: Integration[]): void => {
    const existingData = localStorageUtils.getIntegrations();
    if (existingData.length === 0) {
      localStorageUtils.saveIntegrations(mockIntegrations);
    }
  },

  // Dynamic tab qo'shish
  addTabToIntegration: (
    integrationId: string,
    tabData: Omit<IntegrationTab, "id" | "createdAt" | "updatedAt">
  ): Integration | null => {
    const existingIntegrations = localStorageUtils.getIntegrations();
    const integrationIndex = existingIntegrations.findIndex(
      (integration) => integration.id === integrationId
    );

    if (integrationIndex === -1) {
      return null;
    }

    const newTab: IntegrationTab = {
      ...tabData,
      id: `tab_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedIntegration: Integration = {
      ...existingIntegrations[integrationIndex],
      dynamicTabs: [
        ...(existingIntegrations[integrationIndex].dynamicTabs || []),
        newTab,
      ],
      updatedAt: new Date().toISOString(),
    };

    existingIntegrations[integrationIndex] = updatedIntegration;
    localStorageUtils.saveIntegrations(existingIntegrations);
    return updatedIntegration;
  },

  // Dynamic tab o'chirish
  removeTabFromIntegration: (
    integrationId: string,
    tabId: string
  ): Integration | null => {
    const existingIntegrations = localStorageUtils.getIntegrations();
    const integrationIndex = existingIntegrations.findIndex(
      (integration) => integration.id === integrationId
    );

    if (integrationIndex === -1) {
      return null;
    }

    const updatedIntegration: Integration = {
      ...existingIntegrations[integrationIndex],
      dynamicTabs: (
        existingIntegrations[integrationIndex].dynamicTabs || []
      ).filter((tab) => tab.id !== tabId),
      updatedAt: new Date().toISOString(),
    };

    existingIntegrations[integrationIndex] = updatedIntegration;
    localStorageUtils.saveIntegrations(existingIntegrations);
    return updatedIntegration;
  },
};
