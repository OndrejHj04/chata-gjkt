import Albums from "../albums/Albums";
import MyPhotos from "../my-photos/MyPhotos";
import PhotoFeed from "../photo-feed/PhotoFeed";

export default async function Page({ params }: any) {
  const { variant } = await params;
  let content;
  switch (variant) {
    case "albums":
      content = <Albums />;
      break;
    case "my-photos":
      content = <MyPhotos />;
      break;
    case "photo-feed":
      content = <PhotoFeed />;
      break;
  }

  return content;
}
