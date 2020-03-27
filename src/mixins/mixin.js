import {
  getCategories
} from '@/network/params.js'

export const mixinCascader = {
  data() {
    return {
      cateList: [],
      cascaderOptions: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        // checkStrictly: true,
        expandTrigger: 'hover'
      },
      cascaderSelectArr: []
    }
  },
  computed: {
    cateId() {
      if (this.cascaderSelectArr.length === 3) {
        return this.cascaderSelectArr[2]
      }
      return null
    }
  },
  methods: {
    async _getcategories() {
      const { data: res } = await getCategories()
      if (res.meta.status !== 200) {
        return this.handleError(res)
      }
      this.cateList = res.data
    }
  }
}