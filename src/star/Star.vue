<template>
  <div class="star" :class="{'text-center': loading}">
    <b-spinner v-if="loading" variant="primary" label="Spinning"></b-spinner>
    <b-container class="items" v-else>
      <b-card
        class="star-item mr-4 mb-4"
        v-for="item of items"
        :key="item.saId"
        :title="item.name"
        :sub-title="item.createMan + ' - ' + item.createTime.toLocaleDateString()"
        :img-src="item.bigPic"
        :img-alt="item.name"
        img-top
      >
        <b-card-text>{{item.story}}</b-card-text>
        <b-input-group class="mr-2 mb-2 w-auto" prepend="解锁分数">
          <b-form-input v-model.number="item.unlockNum"></b-form-input>
        </b-input-group>
        <b-input-group class="mr-2 mb-2 w-auto" prepend="暴击概率">
          <b-form-input v-model.number="item.hitProbability"></b-form-input>
        </b-input-group>
        <b-input-group class="mr-2 mb-2 w-auto" prepend="暴击概率">
          <b-form-input v-model.number="item.probability"></b-form-input>
        </b-input-group>
        <template #footer>
          <span class="mr-4">
            <b-icon icon="info"></b-icon>
            {{item.type === 2 ? '星球' : '动物'}}
          </span>
          <span>
            <b-icon icon="heart"></b-icon>
            {{item.likeNumber}}
          </span>
        </template>
      </b-card>
    </b-container>
  </div>
</template>

<script lang="ts">
import { getStarAnimals } from '../api/star/get-star-animals'
import { toastError } from '@/toast'
import { checkLoginMixin } from '@/account/account'
export default {
  mixins: [checkLoginMixin],
  data() {
    return {
      loading: true,
      items: []
    }
  },
  async mounted() {
    if (!this.account.isLogin) {
      return
    }
    try {
      const { starAnimalList } = await getStarAnimals()
      this.items = starAnimalList
      console.log(this.items)
    } catch (error) {
      toastError(
        this.$bvToast,
        `加载参数配置发生错误: ${error.message}`,
        '加载失败'
      )
    } finally {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/mixins';
.star {
  .items {
    display: flex;
    flex-wrap: wrap;
    .star-item {
      width: 330px;
      .card-text {
        @include max-line(4);
      }
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
    }
  }
}
</style>