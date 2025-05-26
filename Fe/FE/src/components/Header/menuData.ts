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
  // {
  //   id: 6,
  //   title: "Trang",
  //   newTab: false,
  //   path: "/",
  //   submenu: [
  //     {
  //       id: 69,
  //       title: "Tài khoản của tôi",
  //       newTab: false,
  //       path: "/my-account",
  //     },
  //     {
  //       id: 70,
  //       title: "Liên hệ",
  //       newTab: false,
  //       path: "/contact",
  //     },
  //   ],
  // },
];
