<script setup>
import { onMounted, ref, toRef } from 'vue';
import * as bootstrap from 'bootstrap';

const findMoreModalRef = ref();
let findMoreModal = null;

const props = defineProps(['tempProduct', 'addToCart']);
const productData = toRef(props, 'tempProduct');
let quantity = 1;

const showModal = () => {
  quantity = 1;
  findMoreModal?.show();
};
const hideModal = () => findMoreModal?.hide();

onMounted(() => {
  findMoreModal = new bootstrap.Modal(findMoreModalRef.value, {
    keyboard: false,
    backdrop: false,
  });
});

defineExpose({ showModal, hideModal });
</script>

<template>
  <div
    id="findMoreModal"
    ref="findMoreModalRef"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="findMoreModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="findMoreModalLabel">
            <span>{{ productData.title }}</span>
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="hideModal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6">
              <img class="img-fluid" :src="productData.imagesUrl" alt="" />
            </div>
            <div class="col-sm-6">
              <span class="badge bg-primary rounded-pill">{{ productData.category }}</span>
              <p>商品描述：{{ productData.description }}</p>
              <p>商品內容：{{ productData.content }}</p>
              <div class="h5" v-if="productData.price < productData.origin_price">
                {{ productData.origin_price }} 元
              </div>
              <div v-else>
                <del class="h6">原價 {{ productData.origin_price }} 元</del>
                <div class="h5">現在只要 {{ productData.price }} 元</div>
              </div>
              <div>
                <div class="input-group">
                  <input min="1" type="number" class="form-control" v-model.number="quantity" />
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="addToCart(productData.id, quantity)"
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
            <!-- col-sm-6 end -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
