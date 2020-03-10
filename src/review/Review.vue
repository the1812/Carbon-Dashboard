<template>
  <div class="review" :class="{'text-center': loading}">
    <b-spinner v-if="loading" variant="primary" label="Spinning"></b-spinner>
    <b-container class="items" v-else>
      <b-card
        class="review-item mr-4 mb-4"
        v-for="item of items"
        :key="item.rid"
        :title="item.name"
        :sub-title="item.belong + ' - ' + item.createTime.toLocaleDateString()"
        :img-src="item.image"
        :img-alt="item.name"
        img-top
      >
        <b-card-text>{{item.detail}}</b-card-text>
        <template v-slot:footer>
          <b-row>
            <b-col class="d-flex align-items-center">
              <div>{{item.usage | usage}}</div>
            </b-col>
            <template v-if="item.usage === 0">
              <b-col cols="12" md="auto" class="d-flex">
                <b-button variant="primary" class="mr-2" @click="review(item, 1)">通过</b-button>
                <b-button variant="danger" @click="review(item, 0)">拒绝</b-button>
              </b-col>
            </template>
          </b-row>
        </template>
      </b-card>
    </b-container>
  </div>
</template>

<script lang="ts">
import { checkLoginMixin } from '../account/account'
import { getReviewList, ReviewStatus, Review, postReview, ReviewResult } from '../api/review'
import { toastError } from '@/toast'
import { mapState } from 'vuex'
export default {
  mixins: [checkLoginMixin],
  filters: {
    usage(value: ReviewStatus) {
      switch (value) {
        case ReviewStatus.notReviewed:
        default:
          return '未审核'
        case ReviewStatus.approved:
          return '已通过'
        case ReviewStatus.rejected:
          return '已拒绝'
      }
    }
  },
  data() {
    return {
      items: [],
      loading: true
    }
  },
  computed: {
    ...mapState(['uid']),
  },
  async mounted() {
    if (!this.account.isLogin) {
      return
    }
    try {
      const response = await getReviewList()
      this.items = response.reviewList
    } catch (error) {
      toastError(
        this.$bvToast,
        `加载审核列表发生错误: ${error.message}`,
        '加载失败'
      )
    } finally {
      this.loading = false
    }
  },
  methods: {
    async review(review: Review, type: ReviewResult) {
      review.usage = type === ReviewResult.approved ? ReviewStatus.approved : ReviewStatus.rejected
      const { status } = await postReview(this.account.uid, review.rid, type)
      console.log(status, review.rid, type)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@/mixins';
.review {
  .items {
    display: flex;
    flex-wrap: wrap;
    .review-item {
      width: 330px;
      .card-text {
        @include max-line(4);
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