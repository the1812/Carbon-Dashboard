<template>
  <div class="shop" :class="{'text-center': loading}">
    <b-spinner v-if="loading" variant="primary" label="Spinning"></b-spinner>
    <b-container class="items" v-else>
      <div v-if="!editing" class="shopping-item add-item mr-4 mb-4" @click="editing = true">
        <b-icon icon="plus" variant="gray" class="add-item-icon"></b-icon>
      </div>
      <b-form @submit="submitNewItem" class="shopping-item add-item mr-4 mb-4 editing" v-else>
        <b-card>
          <b-form-input
            :disabled="submitting"
            class="mb-2"
            v-model="newItem.name"
            placeholder="商品名称"
          ></b-form-input>
          <b-form-textarea
            :disabled="submitting"
            class="mb-2"
            v-model="newItem.detail"
            placeholder="商品描述"
            rows="1"
            max-rows="3"
          ></b-form-textarea>
          <b-input-group class="mb-2">
            <b-form-input :disabled="submitting" v-model.number="newItem.score" placeholder="所需积分"></b-form-input>
            <b-form-input
              :disabled="submitting"
              v-model.number="newItem.totalNumber"
              placeholder="库存量"
            ></b-form-input>
          </b-input-group>
          <b-input-group class="mb-2">
            <b-form-file
              :disabled="submitting"
              placeholder="大图片"
              accept="image/*"
              browse-text="浏览"
              v-model="newItem.bigImage"
            ></b-form-file>
            <b-form-file
              :disabled="submitting"
              placeholder="小图片"
              accept="image/*"
              browse-text="浏览"
              v-model="newItem.smallImage"
            ></b-form-file>
          </b-input-group>
          <template #footer>
            <b-button v-if="!submitting" type="submit" variant="primary">提交</b-button>
            <b-spinner class="mr-2" v-else small variant="primary" label="提交中"></b-spinner>
            <b-button :disabled="submitting" @click="editing = false">取消</b-button>
          </template>
        </b-card>
      </b-form>
      <b-card
        class="shopping-item mr-4 mb-4"
        v-for="item of items"
        :key="item.spId"
        :title="item.name"
        :img-src="item.bigImage"
        :img-alt="item.name"
        img-top
      >
        <b-card-text>{{item.detail}}</b-card-text>
        <b-card-text>
          <div class="score">
            <span class="number mr-1">{{item.score}}</span>积分
          </div>
        </b-card-text>
        <template #footer>
          <span class="now mr-2">剩余{{item.nowNumber}}件</span>
          <span class="total">共{{item.totalNumber}}件</span>
        </template>
      </b-card>
    </b-container>
  </div>
</template>

<script lang="ts">
import { checkLoginMixin } from '../account/account'
import { toastError, toastSuccess } from '@/toast'
import { getShoppings } from '../api/shop/get-shoppings'
import { Shopping } from '../api/shop/shopping'
import {
  getNewShoppingId,
  uploadImage,
  uploadShopping
} from '../api/shop/upload'
export default {
  mixins: [checkLoginMixin],
  data() {
    return {
      loading: true,
      editing: false,
      submitting: false,
      newItem: {
        name: '',
        bigImage: null,
        smallImage: null,
        detail: '',
        score: '',
        totalNumber: ''
      },
      items: []
    }
  },
  async mounted() {
    if (!this.account.isLogin){
      return
    }
    try {
      const response = await getShoppings()
      this.items = response.shoppingList
    } catch (error) {
      toastError(
        this.$bvToast,
        `加载商品列表发生错误: ${error.message}`,
        '加载失败'
      )
    } finally {
      this.loading = false
    }
  },
  methods: {
    async submitNewItem(e: Event) {
      e.preventDefault()
      const {
        name,
        bigImage,
        smallImage,
        detail,
        score,
        totalNumber
      } = this.newItem
      try {
        this.submitting = true
        const { shoppingId: id } = await getNewShoppingId()
        let bigImagePath = ''
        if (bigImage !== null) {
          const { path } = await uploadImage(id, bigImage)
          bigImagePath = path
        }
        let smallImagePath = ''
        if (smallImage !== null) {
          const { path } = await uploadImage(id, smallImage)
          smallImagePath = path
        }
        await uploadShopping({
          spId: id,
          name,
          detail,
          bigImage: bigImagePath,
          smallImage: smallImagePath,
          score,
          totalNumber
        })
        this.items = (await getShoppings()).shoppingList
        this.newItem = {
          name: '',
          bigImage: null,
          smallImage: null,
          detail: '',
          score: '',
          totalNumber: ''
        }
        toastSuccess(this.$bvToast, '上传成功', '商品管理')
        this.editing = false
      } catch (error) {
        toastError(this.$bvToast, `上传失败: ${error.message}`, '商品管理')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shop {
  .items {
    display: flex;
    flex-wrap: wrap;
    .add-item {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed rgba(0, 0, 0, 0.125);
      border-radius: 0.25rem;
      cursor: pointer;
      &-icon {
        font-size: 48px;
      }
      &:hover {
        border-color: rgba(0, 0, 0, 0.5);
      }
      &.editing {
        border: none;
        cursor: initial;
      }
    }
    .shopping-item {
      width: 330px;
      .score {
        color: var(--primary);
        font-size: 24px;
        font-weight: bold;
        line-height: 1;
        .number {
          font-size: 48px;
          display: inline-block;
        }
      }
      img {
        width: 330px;
        height: 100px;
        object-fit: cover;
      }
      .total {
        opacity: 0.5;
      }
    }
  }
}
</style>