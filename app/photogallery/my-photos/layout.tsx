import PhotogalleryLayoutComponent from "../components/PhotogalleryLayoutComponent";

export default function Layout({ children }: any) {
  return (
    <PhotogalleryLayoutComponent variant="my-photos">
      {children}
    </PhotogalleryLayoutComponent>
  );
}
