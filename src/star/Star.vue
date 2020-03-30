<template>
  <div class="star">
    <b-row class="align-items-center d-flex justify-content-between mb-4">
      <b-input-group class="mr-2 mb-2 w-auto" prepend="权重设置">
        <b-form-select v-model="weightType" :options="weightTypes"></b-form-select>
        <b-form-input v-model.number="weight"></b-form-input>
        <b-button class="ml-2" variant="primary" @click="saveWeight()">保存</b-button>
      </b-input-group>
      <b-button v-b-modal.notice-modal variant="outline-primary">发布新公告</b-button>
      <b-modal id="notice-modal" title="发布新公告" @ok="submitNotice()">
        <b-form-input placeholder="标题" class="mb-2" v-model="noticeTitle"></b-form-input>
        <b-form-textarea placeholder="正文" v-model="noticeContent"></b-form-textarea>
        <template #modal-ok>发布</template>
        <template #modal-cancel>取消</template>
      </b-modal>
    </b-row>
    <b-row>
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
            <b-form-input v-model.number="item.unlockNum" @change="saveStarAnimal()" debounce="500"></b-form-input>
          </b-input-group>
          <b-input-group class="mr-2 mb-2 w-auto" prepend="暴击概率">
            <b-form-input
              v-model.number="item.hitProbability"
              @change="saveStarAnimal()"
              debounce="500"
            ></b-form-input>
          </b-input-group>
          <b-input-group class="mr-2 mb-2 w-auto" prepend="暴击概率">
            <b-form-input
              v-model.number="item.probability"
              @change="saveStarAnimal()"
              debounce="500"
            ></b-form-input>
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
    </b-row>
  </div>
</template>

<script lang="ts">
import { getStarAnimals } from '../api/star/get-star-animals'
import { toastError, toastSuccess } from '@/toast'
import { checkLoginMixin } from '@/account/account'
import { TrafficType } from '../api/city/traffic'
export default {
  mixins: [checkLoginMixin],
  data() {
    return {
      loading: true,
      items: [],
      weight: 1,
      weightType: TrafficType.metro,
      weightTypes: [
        {
          value: TrafficType.metro,
          text: '地铁'
        },
        {
          value: TrafficType.bus,
          text: '公交'
        }
      ],
      noticeTitle: '',
      noticeContent: ''
    }
  },
  methods: {
    saveWeight() {
      toastSuccess(this.$bvToast, '保存成功!', '权重配置')
    },
    saveStarAnimal() {
      toastSuccess(this.$bvToast, '已自动保存.', '参数配置')
    },
    submitNotice() {
      toastSuccess(this.$bvToast, '发布成功!', '公告管理')
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