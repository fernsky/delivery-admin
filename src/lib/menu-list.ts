import { PersonIcon } from "@radix-ui/react-icons";
import {
  LayoutGrid,
  LucideIcon,
  LandPlot,
  UsersRound,
  AreaChart,
  FormInput,
  GitPullRequest,
  Building2,
  ScanBarcode,
  Store,
  User2Icon,
  Paperclip,
  Home,
  PersonStanding,
  BarChart3, // For demographic summary icon
  LineChart, // Add this import for the ward time series icon
} from "lucide-react";

export type Role = "admin" | "superadmin" | "enumerator";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
  roles?: Role[];
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  roles?: Role[];
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

const menuConfig: Menu[] = [
  {
    href: "/",
    label: "होम",
    icon: LayoutGrid,
    roles: ["admin", "superadmin", "enumerator"],
  },
  // Demographics submenu with children
  {
    href: "#",
    label: "जनसांख्यिकी",
    icon: BarChart3,
    roles: ["admin", "superadmin"],
    submenus: [
      {
        href: "/digital-profile/demographics/demographics-summary",
        label: "जनसांख्यिकीय सारांश",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/digital-profile/demographics/ward-time-series",
        label: "वडा जनसंख्या समयावधि",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/digital-profile/demographics/ward-househead-gender",
        label: "वडा घरमूली लिङ्ग",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/digital-profile/demographics/ward-age-population",
        label: "उमेर अनुसार जनसंख्या",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/digital-profile/demographics/ward-wise-demographic-summary",
        label: "वडा अनुसार जनसांख्यिकीय सारांश",
        roles: ["admin", "superadmin"],
      },
       {
        href: "/digital-profile/demographics/ward-wise-caste-population", 
        label: "वडा अनुसार जात/जनजाति जनसंख्या",
        roles: ["admin", "superadmin"],
      },
        {
        href: "/digital-profile/demographics/ward-wise-mother-tongue-population",
        label: "वडा अनुसार मातृभाषा जनसंख्या",
        roles: ["admin", "superadmin"],
      }
    ],
  },

  //   {
  //     href: "/qr-code",
  //     label: "क्यूआर कोड",
  //     icon: ScanBarcode,
  //     roles: ["enumerator"],
  //   },
  //   {
  //     href: "/requested-areas",
  //     label: "अनुरोध गरिएका क्षेत्रहरू",
  //     icon: LandPlot,
  //     roles: ["enumerator"],
  //   },
  //   {
  //     href: "/account",
  //     label: "प्रयोगकर्ता खाता",
  //     icon: User2Icon,
  //     roles: ["enumerator"],
  //   },
  //   {
  //     href: "/collections",
  //     label: "मेरो संग्रह",
  //     icon: Paperclip,
  //     roles: ["enumerator"],
  //   },

  //   {
  //     href: "/ward",
  //     label: "वडाहरू",
  //     icon: AreaChart,
  //     roles: ["admin", "superadmin"],
  //     submenus: [],
  //   },
  //   {
  //     href: "/area",
  //     label: "क्षेत्रहरू",
  //     icon: LandPlot,
  //     roles: ["admin", "superadmin"],
  //     submenus: [],
  //   },
  //   {
  //     href: "/buildings",
  //     label: "भवनहरू",
  //     icon: Building2,
  //     roles: ["admin", "superadmin"],
  //   },
  //   {
  //     href: "/businesses",
  //     label: "व्यवसायहरू",
  //     icon: Store,
  //     roles: ["admin", "superadmin"],
  //   },
  //   {
  //     href: "/families",
  //     label: "परिवारहरू",
  //     icon: UsersRound,
  //     roles: ["admin", "superadmin"],
  //   },
  // {
  //     href: "/submissions",
  //     label: "प्रस्तुतिहरू",
  //     icon: Paperclip,
  //     roles: ["admin", "superadmin"],
  //     submenus: [],
  //   },
  //   {
  //     href:"/wardwise",
  //     label: "वडा अनुसार डाटा",
  //     icon:Home,
  //     roles: ["admin", "superadmin"],
  //     submenus:[],
  //   },
  //  {
  //     href:"/enumeratorwise",
  //     label: "गणकअनुसार डाटा",
  //     icon:PersonStanding,
  //     roles: ["admin", "superadmin"],
  //     submenus:[],
  //   },
  //   {
  //     href: "/individuals",
  //     label: "व्यक्तिहरू",
  //     icon: User2Icon,
  //     roles: ["admin", "superadmin"],
  //   },
  //   {
  //     href: "/deaths",
  //     label: "मृत्युहरू",
  //     icon: GitPullRequest,
  //     roles: ["admin", "superadmin"],
  //   },
  //   {
  //     href: "/enumerators",
  //     label: "गणकहरू",
  //     icon: UsersRound,
  //     roles: ["admin", "superadmin"],
  //     submenus: [],
  //   },
];

export function getMenuList(pathname: string, userRole: Role): Group[] {
  const filteredMenus = menuConfig.filter(
    (menu) => !menu.roles || menu.roles.includes(userRole),
  );

  return [
    {
      groupLabel: "",
      menus: filteredMenus,
    },
  ];
}
