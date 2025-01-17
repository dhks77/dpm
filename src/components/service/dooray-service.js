import axios from "axios";
import ObservableUtils from "../utils/obserable-utils";
import { Observable } from "rxjs";

const DoorayKey = {
  projectId: "2559193520715588701"
};

export const DoorayService = {
  getPostsAll(tagIds) {
    return Observable.create(emitter => {
      function callApi(page) {
        DoorayService.getPosts(page, tagIds).subscribe(contents => {
          if (contents.length > 0) {
            emitter.next(contents);
          }

          if (page > 50 || contents.length < 30) {
            emitter.complete();
          } else {
            callApi(page + 1);
          }
        });
      }
      callApi(0);
    });
  },
  getPosts(page, tagIds) {
    return ObservableUtils.fromPromise(
      axios.get(`/api/dooray/v2/wapi/projects/!${DoorayKey.projectId}/posts`, {
        params: Object.assign(
          {
            order: "-createdAt",
            hasParent: "true",
            page: page,
            size: 30
          },
          tagIds
        )
      })
    ).map(response => response.data.result.contents);
  },
  getSubPosts(number) {
    return ObservableUtils.fromPromise(
      axios.get(`/api/dooray/v2/wapi/projects/!${DoorayKey.projectId}/posts/${number}/sub-posts`)
    ).map(response => response.data.result.contents);
  },
  getTags() {
    return ObservableUtils.fromPromise(
      axios.get(`/api/dooray/v2/wapi/projects/!${DoorayKey.projectId}/tags`, {
        params: {
          size: 10000
        }
      })
    ).map(response => response.data.result.contents);
  },
  getMileStones() {
    return ObservableUtils.fromPromise(
      axios.get(
        `/api/dooray/v2/wapi/projects/!${DoorayKey.projectId}/milestones`,
        {
          params: {
            size: 10000
          }
        }
      )
    ).map(response => response.data.result.contents);
  },
  modifyTags(postIdList, removeTagIdList, addTagIdList) {
    return ObservableUtils.fromPromise(
      axios.post(
        `/api/dooray/v2/wapi/projects/!${
          DoorayKey.projectId
        }/posts/modify-tags`,
        {
          postIdList: postIdList,
          addTagIdList: addTagIdList,
          removeTagIdList: removeTagIdList
        }
      )
    ).map(response => response.header);
  },
  modifyMileStone(postIdList, milestoneId) {
    return ObservableUtils.fromPromise(
      axios.post(
        `/api/dooray/v2/wapi/projects/!${
          DoorayKey.projectId
        }/posts/set-milestone`,
        {
          postIdList: postIdList,
          milestoneId: milestoneId
        }
      )
    ).map(response => response.header);
  },
  modifyDueDate(postNumber, dueDate) {
    return ObservableUtils.fromPromise(
      axios.put(
        `/api/dooray/v2/wapi/projects/!${
          DoorayKey.projectId
        }/posts/${postNumber}`,
        {
          dueDate: dueDate,
          dueDateFlag: true
        }
      )
    ).map(response => response.header);
  }
};

export default DoorayService;
