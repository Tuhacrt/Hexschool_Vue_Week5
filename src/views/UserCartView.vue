<script setup>
import { reactive, onMounted, ref } from 'vue';
import axios from 'axios';
import {
  Form, Field, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import AllRules from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW';

import FindMoreModal from '../components/FindMoreModal.vue';

defineRule('required', AllRules.required);
defineRule('email', AllRules.email);
defineRule('min', AllRules.min);
defineRule('max', AllRules.max);
configure({ generateMessage: localize({ zh_TW: zhTW }) });
setLocale('zh_TW');

const { VITE_URL, VITE_PATH } = import.meta.env;
const state = reactive({
  loadingStatus: {
    loadingItem: '',
  },
  products: [],
  tempProduct: [],
  pagination: {},
  form: {
    user: {
      name: '',
      email: '',
      tel: '',
      address: '',
    },
    message: '',
    reset() {
      this.user = {
        name: '',
        email: '',
        tel: '',
        address: '',
      };
      this.message = '';
    },
  },
  cart: {},
});
const findMoreModalRef = ref();

const getProductList = async () => {
  const url = `${VITE_URL}/api/${VITE_PATH}/products/all`;
  try {
    const response = await axios.get(url);
    state.products = response.data.products;
  } catch (error) {
    alert(error.response?.data.message);
  }
};

const getCart = async () => {
  const url = `${VITE_URL}/api/${VITE_PATH}/cart`;
  try {
    const response = await axios.get(url);
    state.cart = response.data.data;
  } catch (error) {
    alert(error.response?.data.message);
  }
};

const updateCart = async (productData) => {
  const url = `${VITE_URL}/api/${VITE_PATH}/cart/${productData.id}`;
  const data = { product_id: productData.id, qty: productData.qty };
  state.loadingStatus.loadingItem = productData.id;
  try {
    const response = await axios.put(url, { data });
    alert(response.data.message);
    state.loadingStatus.loadingItem = '';
    getCart();
  } catch (error) {
    alert(error.response?.data.message);
  }
};

const addToCart = async (productId, quantity = 1) => {
  const url = `${VITE_URL}/api/${VITE_PATH}/cart`;
  const data = {
    product_id: productId,
    qty: quantity,
  };
  state.loadingStatus.loadingItem = productId;
  try {
    const response = await axios.post(url, { data });
    alert(response.data.message);
    state.loadingStatus.loadingItem = '';
    findMoreModalRef.value?.hideModal();
    getCart();
  } catch (error) {
    alert(error.response?.data.message);
  }
};

const deleteAllCarts = async () => {
  const url = `${VITE_URL}/api/${VITE_PATH}/carts`;
  try {
    const response = await axios.delete(url);
    alert(response.data.message);
    getCart();
  } catch (error) {
    alert(error.response?.data.message);
  }
};

const removeCartItem = async (productId) => {
  const url = `${VITE_URL}/api/${VITE_PATH}/cart/${productId}`;
  state.loadingStatus.loadingItem = productId;
  try {
    const response = await axios.delete(url);
    alert(response.data.message);
    state.loadingStatus.loadingItem = '';
    getCart();
  } catch (error) {
    alert(error.response?.data.message);
  }
};

const createOrder = async () => {
  const url = `${VITE_URL}/api/${VITE_PATH}/order`;
  const data = state.form;
  try {
    const response = await axios.post(url, { data });
    alert(response.data.message);
    state.form.reset();
    getCart();
  } catch (error) {
    alert(error.response?.data.message);
  }
};

onMounted(() => {
  getProductList();
  getCart();
});

const openModal = (modalType, currentProduct) => {
  switch (modalType) {
    case 'findMore':
      state.tempProduct = { ...currentProduct };
      findMoreModalRef.value?.showModal();
      break;
    default:
      break;
  }
};
</script>

<template>
  <div class="container">
    <div class="mt-4">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>??????</th>
            <th>????????????</th>
            <th>??????</th>
            <th />
          </tr>
        </thead>
        <tbody v-if="state.products?.length">
          <tr v-for="product in state.products" :key="product.id">
            <td style="width: 200px">
              <div
                style="height: 100px; background-size: cover; background-position: center"
                :style="{ backgroundImage: `url(${product.imagesUrl[0]})` }"
              />
            </td>
            <td>{{ product.title }}</td>
            <td>
              <div v-if="product.price < product.origin_price">
                <del class="h6">?????? {{ product.origin_price }} ???</del>
                <div class="h5">???????????? {{ product.price }} ???</div>
              </div>
              <div class="h5" v-else>{{ product.origin_price }} ???</div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="openModal('findMore', product)"
                  :disabled="state.loadingStatus.loadingItem === product.id || !product.is_enabled"
                >
                  <font-awesome-icon
                    icon="fas fa-spinner"
                    pulse
                    v-if="state.loadingStatus.loadingItem === product.id"
                  />
                  ????????????
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  @click="addToCart(product.id)"
                  :disabled="state.loadingStatus.loadingItem === product.id || !product.is_enabled"
                >
                  <font-awesome-icon
                    icon="fas fa-spinner"
                    pulse
                    v-if="state.loadingStatus.loadingItem === product.id"
                  />
                  ???????????????
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-end">
        <button class="btn btn-outline-danger" type="button" @click="deleteAllCarts">
          ???????????????
        </button>
      </div>
      <table class="table align-middle">
        <thead>
          <tr>
            <th />
            <th>??????</th>
            <th style="width: 150px">??????/??????</th>
            <th>??????</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="state.cart?.carts">
            <tr v-for="item in state.cart.carts" :key="item.id">
              <td>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="removeCartItem(item.id)"
                  :disabled="state.loadingStatus.loadingItem === item.id"
                >
                  <font-awesome-icon
                    icon="fas fa-spinner"
                    pulse
                    v-if="state.loadingStatus.loadingItem === item.id"
                  />
                  <div v-else>x</div>
                </button>
              </td>
              <td>
                {{ item.product.title }}
                <div v-if="item.product.price < item.product.origin_price" class="text-success">
                  ??????????????????
                </div>
              </td>
              <td>
                <div class="input-group input-group-sm">
                  <div class="input-group mb-3">
                    <input
                      min="1"
                      type="number"
                      class="form-control"
                      v-model.number="item.qty"
                      @change="updateCart(item)"
                      :disabled="state.loadingStatus.loadingItem === item.id"
                    />
                    <span class="input-group-text" id="basic-addon2">{{ item.product.unit }}</span>
                  </div>
                </div>
              </td>
              <td class="text-end">
                <small class="text-success" v-if="item.product.price < item.product.origin_price"
                  >????????????{{ item.final_total }}</small
                >
                <small v-else>{{ item.total }}</small>
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr v-if="state.cart.final_total < state.cart.total">
            <td colspan="3" class="text-end text-success">?????????</td>
            <td class="text-end text-success">{{ state.cart.final_total }}</td>
          </tr>
          <tr v-else>
            <td colspan="3" class="text-end">??????</td>
            <td class="text-end">{{ state.cart.total }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <!-- Form -->
    <div class="my-5 row justify-content-center">
      <Form class="col-md-6" v-slot="{ errors }" @submit="createOrder">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <Field
            id="email"
            name="email"
            label="Email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            placeholder="????????? Email"
            v-model="state.form.user.email"
            rules="required|email"
          ></Field>
          <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
        </div>
        <div class="mb-3">
          <label for="name" class="form-label">???????????????</label>
          <Field
            id="name"
            name="name"
            label="??????"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
            placeholder="???????????????"
            v-model="state.form.user.name"
            rules="required"
          ></Field>
          <ErrorMessage name="name" class="invalid-feedback"></ErrorMessage>
        </div>
        <div class="mb-3">
          <label for="tel" class="form-label">???????????????</label>
          <Field
            id="tel"
            name="tel"
            label="??????"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.tel }"
            placeholder="???????????????"
            v-model="state.form.user.tel"
            rules="required|min:8|max:10"
          ></Field>
          <ErrorMessage name="tel" class="invalid-feedback"></ErrorMessage>
        </div>
        <div class="mb-3">
          <label for="address" class="form-label">???????????????</label>
          <Field
            id="address"
            name="address"
            label="??????"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.address }"
            placeholder="???????????????"
            v-model="state.form.user.address"
            rules="required"
          ></Field>
          <ErrorMessage name="address" class="invalid-feedback"></ErrorMessage>
        </div>
        <div class="mb-3">
          <label for="message" class="form-label">??????</label>
          <textarea
            id="message"
            class="form-control"
            cols="30"
            rows="10"
            v-model="state.form.message"
          ></textarea>
        </div>
        <div class="text-end">
          <button type="submit" class="btn btn-danger">????????????</button>
        </div>
      </Form>
    </div>
    <!-- Form -->
  </div>
  <!-- Modal -->
  <FindMoreModal
    :temp-product="state.tempProduct"
    :add-to-cart="addToCart"
    ref="findMoreModalRef"
  />
  <!-- Modal -->
</template>
