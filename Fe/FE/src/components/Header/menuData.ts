import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 1,
    title: "Phổ biến",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Cửa hàng",
    newTab: false,
    path: "/shop-with-sidebar",
  },
  {
    id: 3,
    title: "Liên hệ",
    newTab: false,
    path: "/contact",
  },
  {
    id: 6,
    title: "Trang",
    newTab: false,
    path: "/",
    submenu: [
      {
        id: 61,
        title: "Cửa hàng có thanh bên",
        newTab: false,
        path: "/shop-with-sidebar",
      },
      {
        id: 62,
        title: "Cửa hàng không có thanh bên",
        newTab: false,
        path: "/shop-without-sidebar",
      },
      {
        id: 64,
        title: "Thanh toán",
        newTab: false,
        path: "/checkout",
      },
      {
        id: 65,
        title: "Giỏ hàng",
        newTab: false,
        path: "/cart",
      },
      {
        id: 66,
        title: "Danh sách yêu thích",
        newTab: false,
        path: "/wishlist",
      },
      {
        id: 67,
        title: "Đăng nhập",
        newTab: false,
        path: "/signin",
      },
      {
        id: 68,
        title: "Đăng ký",
        newTab: false,
        path: "/signup",
      },
      {
        id: 69,
        title: "Tài khoản của tôi",
        newTab: false,
        path: "/my-account",
      },
      {
        id: 70,
        title: "Liên hệ",
        newTab: false,
        path: "/contact",
      },
    ],
  },
];
