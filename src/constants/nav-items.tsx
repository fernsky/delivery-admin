import {
  ChevronDown,
  FileText,
  Layout,
  Users,
  PieChart,
  BookOpen,
  Activity,
  Building,
} from "lucide-react";
import { NavItem } from "@/store/sidebar-nav-store";

export const navItems: NavItem[] = [
  {
    title: "खजुरा प्रोफाइल",
    href: "/profile",
    icon: <Layout className="w-4 h-4" />,
    items: [],
  },
  {
    title: "जनसांख्यिक विवरण",
    href: "/profile/demographics",
    icon: <Users className="w-4 h-4" />,
    items: [
      {
        title: "जनसंख्याको सारांश",
        href: "/profile/demographics/ward-wise-summary",
      },
      {
        title: "उमेर र लिङ्ग अनुसार जनसंख्या",
        href: "/profile/demographics/ward-age-wise-population",
      },
      {
        title: "मातृभाषा अनुसार जनसंख्या",
        href: "/profile/demographics/ward-wise-mother-tongue-population",
      },
      {
        title: "धर्म अनुसार जनसंख्या",
        href: "/profile/demographics/ward-wise-religion-population",
      },
      {
        title: "जात/जनजाति अनुसार जनसंख्या",
        href: "/profile/demographics/ward-wise-caste-population",
      },
      {
        title: "घरमुलीको लिङ्ग अनुसार घरधुरी",
        href: "/profile/demographics/ward-wise-househead-gender",
      },
      {
        title: "पेशाको आधारमा जनसंख्या",
        href: "/profile/demographics/ward-main-occupations",
      },
      {
        title: "आर्थिक रुपले सक्रिय जनसंख्या",
        href: "/profile/demographics/ward-age-wise-economically-active-population",
      },
      {
        title: "अपाङ्गता कारणका आधारमा जनसंख्या",
        href: "/profile/demographics/ward-wise-disability-cause",
      },
      {
        title: "जन्म स्थानको आधारमा घरधुरी",
        href: "/profile/demographics/ward-wise-birthplace-households",
      },
      {
        title: "बालबालिकाको जन्मदर्ताको आधारमा जनसंख्या",
        href: "/profile/demographics/ward-wise-birth-certificate-population",
      },
      {
        title: "विगत १२ महिनामा मृत्यु भएकाको विवरण",
        href: "/profile/demographics/ward-age-gender-wise-deceased-population",
      },
      {
        title: "मृत्युको कारण अनुसार मृतकको संख्या",
        href: "/profile/demographics/ward-death-causes",
      },
    ],
  },
  {
    title: "आर्थिक अवस्था",
    href: "/profile/economics",
    icon: <PieChart className="w-4 h-4" />,
    items: [
      {
        title: "विशेष सीप भएका मानव संशाधनको विवरण",
        href: "/profile/economics/ward-main-skills",
      },
      {
        title: "घरको स्वामित्वको आधारमा घरधुरी",
        href: "/profile/economics/ward-wise-house-ownership",
      },
      {
        title: "जगको आधारमा घरधुरी",
        href: "/profile/economics/ward-wise-household-base",
      },
      {
        title: "बाहिरी गारोको आधारमा घरधुरी",
        href: "/profile/economics/ward-wise-household-outer-wall",
      },
      {
        title: "वैदेशिक रोजगारीमा गएकाहरूको विवरण",
        href: "/profile/economics/ward-wise-foreign-employment-countries",
      },
      {
        title: "वैदेशिक रोजगारीबाट प्राप्त विप्रेषण",
        href: "/profile/economics/ward-wise-remittance",
      },
      {
        title: "जग्गाको स्वामित्वको आधारमा घरधुरी",
        href: "/profile/economics/ward-wise-land-ownership",
      },
      {
        title: "सिंचाई सुविधाको उपलब्धता",
        href: "/profile/economics/ward-wise-irrigated-area",
      },
      {
        title: "सिंचाईको स्रोतको आधारमा सिंचित जमिन",
        href: "/profile/economics/municipality-wide-irrigation-source",
      },
      {
        title: "अन्नबाली उत्पादन सम्बन्धी विवरण",
        href: "/profile/economics/municipality-wide-food-crops",
      },
      {
        title: "दलहनबाली उत्पादन सम्बन्धी विवरण",
        href: "/profile/economics/municipality-wide-pulses",
      },
      {
        title: "तेलबाली उत्पादन सम्बन्धी विवरण",
        href: "/profile/economics/municipality-wide-oil-seeds",
      },
      {
        title: "फलफुलबाली उत्पादन सम्बन्धी विवरण",
        href: "/profile/economics/municipality-wide-fruits",
      },
      {
        title: "मसलाबाली उत्पादन सम्बन्धी विवरण",
        href: "/profile/economics/municipality-wide-spices",
      },
      {
        title: "तरकारीबाली उत्पादन सम्बन्धी विवरण",
        href: "/profile/economics/municipality-wide-vegetables",
      },
      {
        title: "पशुपन्छीजन्य वस्तुको उत्पादन सम्बन्धी विवरण",
        href: "/profile/economics/municipality-wide-animal-products",
      },
      {
        title: "खाद्यान्न बालीमा लाग्ने रोग विवरण",
        href: "/profile/economics/municipality-wide-crop-diseases",
      },
      {
        title: "तरकारी तथा फलफूलमा लाग्ने रोग/किरा",
        href: "/profile/economics/municipality-wide-vegetables-and-fruits-diseases",
      },
      {
        title: "व्यवसायिक कृषि/पशुपालन फर्महरू",
        href: "/profile/economics/commercial-agricultural-animal-husbandry-farmers-group",
      },
      {
        title: "कृषि वा पशुपालन उत्पादनमा आबद्ध घरधुरी",
        href: "/profile/economics/ward-wise-households-in-agriculture",
      },
      {
        title: "सहकारी संस्थाहरू सम्बन्धी विवरण",
        href: "/profile/economics/cooperatives",
      },
    ],
  },
  {
    title: "शैक्षिक स्थिति",
    href: "/profile/education",
    icon: <BookOpen className="w-4 h-4" />,
    items: [
      {
        title: "वडागत साक्षरताको विवरण",
        href: "/profile/education/ward-wise-literacy-status",
      },
      {
        title: "उत्तीर्ण गरेको तह",
        href: "/profile/education/ward-wise-educational-level",
      },
      {
        title: "विद्यालय तथा कलेज नजानुको कारण",
        href: "/profile/education/ward-wise-school-dropout",
      },
    ],
  },
  {
    title: "स्वास्थ्य अवस्था",
    href: "/profile/health",
    icon: <Activity className="w-4 h-4" />,
    items: [
      {
        title: "खोप सम्बन्धी विवरण",
        href: "/profile/health/immunization-indicators",
      },
      {
        title: "स्वास्थ्य बीमा गर्ने घरपरिवारको विवरण",
        href: "/profile/health/ward-wise-health-insured-households",
      },
      {
        title: "नजिकको स्वास्थ्य संस्थासम्म पुग्न लाग्ने समय",
        href: "/profile/health/ward-wise-time-to-health-organization",
      },
    ],
  },
  {
    title: "प्रजनन् स्वास्थ्य",
    href: "/profile/fertility",
    icon: <Activity className="w-4 h-4" />,
    items: [
      {
        title: "सुरक्षित मातृत्वको अवस्थाको विवरण",
        href: "/profile/fertility/safe-motherhood-indicators",
      },
      {
        title: "सुत्केरी गराएको स्थान सम्बन्धी विवरण",
        href: "/profile/fertility/ward-wise-delivery-place",
      },
    ],
  },
  // {
  //   title: "भौतिक पूर्वाधार",
  //   href: "/profile/infrastructure",
  //   icon: <Building className="w-4 h-4" />,
  //   items: [
  //     {
  //       title: "सडक नेटवर्क",
  //       href: "/profile/infrastructure/road-network",
  //     },
  //     {
  //       title: "खानेपानी आपूर्ति",
  //       href: "/profile/infrastructure/water-supply",
  //     },
  //   ],
  // },
];
