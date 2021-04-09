import axios from "axios";
const JSON_HEADERS = {
  "Content-Type": "application/json",
};

export class Image {
  public id: string;
  public tags: string[];
  public path: string;
  public thumbnailPath: string;

  public upvotes: number;

  public isVideo: boolean;
  public isAlbum: boolean;

  constructor({
    id = "",
    tags = [] as string[],
    path = "",
    thumbnailPath = "",
    upvotes = 0,
    isVideo = false,
    isAlbum = false,
  } = {}) {
    this.id = id;
    this.tags = tags;
    this.path = path;
    this.thumbnailPath = thumbnailPath;
    this.upvotes = upvotes;
    this.isVideo = isVideo;
    this.isAlbum = isAlbum;
  }

  public getImageType(): string {
    if (this.isAlbum) {
      return "album";
    }
    if (this.isVideo) {
      return "video";
    }
    return "image";
  }

  public matchesTags(tags: string): boolean {
    if (!tags) {
      return true;
    }
    let lowerTags = this.tags.map((t) => t.toLowerCase());
    for (let tag of tags
      .toLowerCase()
      .trim()
      .split(" ")) {
      if (tag.startsWith("!")) {
        if (lowerTags.includes(tag.substring(1))) return false;
      } else if (!lowerTags.includes(tag)) return false;
    }
    return true;
  }

  public post() {
    axios.post(process.env.VUE_APP_CDN_IP + "/images/" + this.id, this, {
      headers: JSON_HEADERS,
    });
  }

  public put() {
    axios.put(process.env.VUE_APP_CDN_IP + "/images/" + this.id, this, {
      headers: JSON_HEADERS,
    });
  }

  public upvote() {
    this.upvotes += 1;
    axios.post(
      process.env.VUE_APP_CDN_IP + "/db/image/" + this.id + "/upvote",
      {},
      { withCredentials: true }
    );
  }

  public downvote() {
    this.upvotes -= 1;
    axios.post(
      process.env.VUE_APP_CDN_IP + "/db/image/" + this.id + "/downvote",
      {},
      { withCredentials: true }
    );
  }
}
