import * as MutationHelpers from 'shared/helpers/vuex/mutationHelpers';
import types from '../mutation-types';
import CustomViewsAPI from '../../api/customViews';

export const state = {
  records: [],
  uiFlags: {
    isFetching: false,
    isCreating: false,
    isDeleting: false,
  },
};

export const getters = {
  getUIFlags(_state) {
    return _state.uiFlags;
  },
  getCustomViews(_state) {
    return _state.records;
  },
  getCustomViewsByFilterType: _state => filterType => {
    return _state.records.filter(record => record.filter_type === filterType);
  },
};

export const actions = {
  get: async function getCustomViews({ commit }, filterType) {
    commit(types.SET_CUSTOM_VIEW_UI_FLAG, { isFetching: true });
    try {
      const response = await CustomViewsAPI.getCustomViewsByFilterType(
        filterType
      );
      commit(types.SET_CUSTOM_VIEW, response.data);
    } catch (error) {
      // Ignore error
    } finally {
      commit(types.SET_CUSTOM_VIEW_UI_FLAG, { isFetching: false });
    }
  },
  create: async function createCustomViews({ commit }, obj) {
    commit(types.SET_CUSTOM_VIEW_UI_FLAG, { isCreating: true });
    try {
      const response = await CustomViewsAPI.create(obj);
      commit(types.ADD_CUSTOM_VIEW, response.data);
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      throw new Error(errorMessage);
    } finally {
      commit(types.SET_CUSTOM_VIEW_UI_FLAG, { isCreating: false });
    }
  },
  update: async function updateCustomViews({ commit }, obj) {
    commit(types.SET_CUSTOM_VIEW_UI_FLAG, { isCreating: true });
    try {
      const response = await CustomViewsAPI.update(obj.id, obj);
      commit(types.UPDATE_CUSTOM_VIEW, response.data);
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      throw new Error(errorMessage);
    } finally {
      commit(types.SET_CUSTOM_VIEW_UI_FLAG, { isCreating: false });
    }
  },
  setCustomViewCount: async ({ commit }, { id, count }) => {
    try {
      commit(types.SET_CUSTOM_VIEW_COUNT, {id, count});
    } catch (error) {
      throw new Error(error);
    }
  },
  delete: async ({ commit }, { id, filterType }) => {
    commit(types.SET_CUSTOM_VIEW_UI_FLAG, { isDeleting: true });
    try {
      await CustomViewsAPI.deleteCustomViews(id, filterType);
      commit(types.DELETE_CUSTOM_VIEW, id);
    } catch (error) {
      throw new Error(error);
    } finally {
      commit(types.SET_CUSTOM_VIEW_UI_FLAG, { isDeleting: false });
    }
  },
};

export const mutations = {
  [types.SET_CUSTOM_VIEW_UI_FLAG](_state, data) {
    _state.uiFlags = {
      ..._state.uiFlags,
      ...data,
    };
  },

  [types.SET_CUSTOM_VIEW_COUNT](_state, data) {
    _state.records.forEach(record => {
      if(record.id === data.id) {
        record.count = data.count
      }
    });
  },

  [types.ADD_CUSTOM_VIEW]: MutationHelpers.create,
  [types.SET_CUSTOM_VIEW]: MutationHelpers.set,
  [types.UPDATE_CUSTOM_VIEW]: MutationHelpers.update,
  [types.DELETE_CUSTOM_VIEW]: MutationHelpers.destroy,
  [types.SET_CUSTOM_VIEW_COUNT]: MutationHelpers.setSingleRecord,
};

export default {
  namespaced: true,
  actions,
  state,
  getters,
  mutations,
};
