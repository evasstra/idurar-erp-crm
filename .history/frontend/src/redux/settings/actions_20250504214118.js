import * as actionTypes from './types';
import { request } from '@/request';

const dispatchSettingsData = (datas) => {
  const settingsCategory = {};

  datas.map((data) => {
    settingsCategory[data.settingCategory] = {
      ...settingsCategory[data.settingCategory],
      [data.settingKey]: data.settingValue,
    };
  });

  return settingsCategory;
};

export const settingsAction = {
  resetState: () => (dispatch) => {
    dispatch({
      type: actionTypes.RESET_STATE,
    });
  },
  updateCurrency:
    ({ data }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.UPDATE_CURRENCY,
        payload: data,
      });
    },
  update:
    ({ entity, settingKey, jsonData }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
      });
      // Use const instead of let, use template literal
      const data = await request.patch({
        entity: `${entity}/updateBySettingKey/${settingKey}`,
        jsonData,
      });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_LOADING,
        });

        // Use const instead of let
        const listData = await request.listAll({ entity });

        if (listData.success === true) {
          const payload = dispatchSettingsData(listData.result);
          window.localStorage.setItem(
            'settings',
            JSON.stringify(dispatchSettingsData(listData.result))
          );

          dispatch({
            type: actionTypes.REQUEST_SUCCESS,
            payload,
          });
          // Removed duplicate payload assignment and dispatch
        } else {
          dispatch({
            type: actionTypes.REQUEST_FAILED,
          });
        }
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
        });
      }
    },
  updateMany:
    ({ entity, jsonData }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
      });
      // Use const instead of let, use template literal
      const data = await request.patch({
        entity: `${entity}/updateManySetting`,
        jsonData,
      });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_LOADING,
        });

        // Use const instead of let
        const listData = await request.listAll({ entity });

        if (listData.success === true) {
          const payload = dispatchSettingsData(listData.result);
          window.localStorage.setItem(
            'settings',
            JSON.stringify(dispatchSettingsData(listData.result))
          );

          dispatch({
            type: actionTypes.REQUEST_SUCCESS,
            payload,
          });
          // Removed duplicate payload assignment and dispatch
        } else {
          dispatch({
            type: actionTypes.REQUEST_FAILED,
          });
        }
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
        });
      }
    },
  list:
    ({ entity }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
      });

      // Use const instead of let
      const data = await request.listAll({ entity });

      if (data.success === true) {
        const payload = dispatchSettingsData(data.result);
        window.localStorage.setItem('settings', JSON.stringify(dispatchSettingsData(data.result)));

        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          payload,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
        });
      }
    },
  upload:
    ({ entity, settingKey, jsonData }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
      });

      // Use const instead of let
      const data = await request.upload({
        entity: entity,
        id: settingKey, // Assuming id should be settingKey based on context
        jsonData,
      });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_LOADING,
        });

        // Use const instead of let
        const listData = await request.listAll({ entity });

        if (listData.success === true) {
          const payload = dispatchSettingsData(data.result);
          window.localStorage.setItem(
            'settings',
            JSON.stringify(dispatchSettingsData(data.result))
          );
          dispatch({
            type: actionTypes.REQUEST_SUCCESS,
            payload,
          });
        } else {
          dispatch({
            type: actionTypes.REQUEST_FAILED,
          });
        }
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
        });
      }
    },
};
