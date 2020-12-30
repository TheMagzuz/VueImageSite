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

  public getImageType(): ImageType {
    if (this.isAlbum) {
      return ImageType.ALBUM;
    }
    if (this.isVideo) {
      return ImageType.VIDEO;
    }
    return ImageType.IMAGE;
  }
}

export enum ImageType {
  IMAGE,
  VIDEO,
  ALBUM,
}
