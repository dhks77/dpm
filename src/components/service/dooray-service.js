import axios from "axios";
import ObservableUtils from "../utils/obserable-utils";
import { Observable } from "rxjs";

const DoorayKey = {
  projectId: "1963480696738741170"
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
            size: 30,
            tagIds: tagIds
          },
          tagIds
        )
      })
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
  }
};

export default DoorayService;
