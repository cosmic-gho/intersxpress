export type ServiceItem = {
  title: string;
  href: string;
  image: string;
  description: string;
};

export type TrackingStatus =
  | "placed"
  | "confirmed"
  | "intransit"
  | "nearby"
  | "out_for_delivery"
  | "delivered";

export type TrackingRecord = {
  id: number;
  trackingId: string;
  status: TrackingStatus;
  pickup: string;
  destination: string;
  currentLocation: string;
  type: string;
  price: string;
  paymentMethod: string;
  width: string;
  height: string;
  length: string;
  weight: string;
  packageName: string;
  comment: string;
  dispatchDate: string;
  expectedDate: string;
  sender: {
    fullName: string;
    country: string;
    email: string;
    phone: string;
  };
  receiver: {
    fullName: string;
    country: string;
    email: string;
    phone: string;
  };
  map: {
    lat: number;
    lng: number;
    destinationLat: number;
    destinationLng: number;
  };
};

export const companyInfo = {
  name: "Inter Express Service",
  email: "support@Fastlane-express.live",
  phone: "+17343834919",
  address: "9170 Millbrook Rd, New jersey, IL 60541",
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact Us" },
];

export const partnerLogos = [
  "/assets/img/partner/partner-1.png",
  "/assets/img/partner/partner-2.png",
  "/assets/img/partner/partner-3.png",
  "/assets/img/partner/partner-4.png",
  "/assets/img/partner/partner-5.png",
];

export const featuredServices: ServiceItem[] = [
  {
    title: "Road Freight",
    href: "/services",
    image: "/assets/img/services/services-1.jpg",
    description:
      "Our road freight products offer secure transportation for standard, partial, full-truck-load, and temperature-controlled shipments.",
  },
  {
    title: "Sea Transport",
    href: "/services",
    image: "/assets/img/services/services-2.jpg",
    description:
      "Full-container-load services deliver reliable, safe, and cost-efficient door-to-door transport around the world.",
  },
  {
    title: "Air Freight",
    href: "/services",
    image: "/assets/img/services/services-3.jpg",
    description:
      "Our air freight specialists handle carriers, customs, compliance, and paperwork for time-sensitive deliveries.",
  },
];

export const allServices: ServiceItem[] = [
  ...featuredServices,
  {
    title: "Packaging",
    href: "/services",
    image: "/assets/img/services/services-4.jpg",
    description:
      "Protective packaging solutions help secure every shipment before it enters transit.",
  },
  {
    title: "Home Delivery",
    href: "/services",
    image: "/assets/img/services/services-5.jpg",
    description:
      "Last-mile delivery keeps recipients informed and gets parcels safely to homes and businesses.",
  },
  {
    title: "Fast Freight",
    href: "/services",
    image: "/assets/img/services/services-6.jpg",
    description:
      "Cross-border freight tools and support streamline international preparation, duties, and country guidance.",
  },
];

export const chooseUsItems = [
  { icon: "calendar", text: "12+ Years Work Experiences" },
  { icon: "globe", text: "World's Areas Covered" },
  { icon: "users", text: "Corporate And Official Client" },
  { icon: "truck", text: "20+ Years Work Experiences" },
];

export const counters = [
  { label: "Today Delivered Packages", value: "972+" },
  { label: "Offices in 25 States Nationwide", value: "27+" },
  { label: "Happy Clients", value: "547+" },
  { label: "Tons of Goods Delivered", value: "440+" },
];

export const testimonials = [
  {
    name: "Denial Peer",
    role: "Marketer",
    image: "/assets/img/testimonials/testimonials-1.jpg",
    quote:
      "Inter Express Service developed a logistics program that fits our local, domestic, and international transportation needs.",
  },
  {
    name: "Anna Dew",
    role: "Developer",
    image: "/assets/img/testimonials/testimonials-2.jpg",
    quote:
      "Customer service is a priority with the Inter Express Service logistics team. We feel we have a real logistics partner.",
  },
  {
    name: "Jecty Smith",
    role: "Staff",
    image: "/assets/img/testimonials/testimonials-3.jpg",
    quote:
      "I only use Inter Express Service for shipping needs because the handling and delivery standards stay consistently excellent.",
  },
];

export const trackingSteps: { key: TrackingStatus; label: string }[] = [
  { key: "placed", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "intransit", label: "In Transit" },
  { key: "nearby", label: "Nearby Hub" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export const trackingRecords: TrackingRecord[] = [
  {
    id: 1,
    trackingId: "SJNSMSBZHS",
    status: "intransit",
    pickup: "Berlin Germany",
    destination: "Germany",
    currentLocation: "Spain",
    type: "Package",
    price: "10,000.00",
    paymentMethod: "PayPal",
    width: "20",
    height: "10",
    length: "12",
    weight: "23",
    packageName: "Package",
    comment: "Good",
    dispatchDate: "2025-04-02 22:18:54",
    expectedDate: "2025-04-02 22:18:56",
    sender: {
      fullName: "Josh Mark",
      country: "United State",
      email: "danieljacksonjohn@gmail.com",
      phone: "+1759374247448",
    },
    receiver: {
      fullName: "Kate Mark",
      country: "Canada",
      email: "danieljacksonjohn@gmail.com",
      phone: "+1937364274837",
    },
    map: { lat: 40.73061, lng: -73.935242, destinationLat: 52.52, destinationLng: 13.405 },
  },
  {
    id: 2,
    trackingId: "FHE28BWHEX",
    status: "out_for_delivery",
    pickup: "Ireland",
    destination: "Sacramento, California",
    currentLocation: "Oregon",
    type: "Package",
    price: "$1500",
    paymentMethod: "Bitcoin",
    width: "12 inches wide",
    height: "8 inches high",
    length: "16 inches long",
    weight: "36 kg",
    packageName: "Package",
    comment: "This package should be delivered to Sara Bennett only",
    dispatchDate: "2025-04-03 15:59:04",
    expectedDate: "2025-04-05 18:30:00",
    sender: {
      fullName: "Cian Ducrot",
      country: "Ireland",
      email: "cianducrotcontactofficialmail@gmail.com",
      phone: "N/A",
    },
    receiver: {
      fullName: "Sara Bennett",
      country: "United State Of America",
      email: "nakuranasai@gmail.com",
      phone: "+19162369200",
    },
    map: { lat: 43.8041, lng: 120.5542, destinationLat: 38.5816, destinationLng: -121.4944 },
  },
  {
    id: 7,
    trackingId: "HSJRNAR12Y",
    status: "out_for_delivery",
    pickup: "United States",
    destination: "73 rue de Cahors, 59640 Dunkerque France",
    currentLocation: "Jersey",
    type: "Package",
    price: "EUR 10,000",
    paymentMethod: "Bank Transfer",
    width: "12 inches wide",
    height: "8 inches high",
    length: "16 inches long",
    weight: "36kg",
    packageName: "Security Safe Box",
    comment:
      "This package is very important to my fiance and it is important that it is delivered very fast.",
    dispatchDate: "2025-04-09 02:29:13",
    expectedDate: "2025-04-15 02:34:27",
    sender: {
      fullName: "Michael Philip Jagger",
      country: "United States Of America",
      email: "michaelphilipjagger@privatemail.com",
      phone: "N/A",
    },
    receiver: {
      fullName: "Danielle Suzanne Germaine",
      country: "France",
      email: "darobert@wanadoo.fr",
      phone: "0637232796",
    },
    map: { lat: 49.2138, lng: -2.1358, destinationLat: 51.0344, destinationLng: 2.3768 },
  },
  {
    id: 8,
    trackingId: "WUSJEGS62H",
    status: "intransit",
    pickup: "Ontario Canada",
    destination: "22607 Savannah Heights Von Ormy Texas 78073",
    currentLocation: "Ontario Canada",
    type: "Package",
    price: "$2500",
    paymentMethod: "Zelle Transfer",
    width: "19 inches wide",
    height: "10 inches high",
    length: "18 inches long",
    weight: "92kg",
    packageName: "Classified",
    comment:
      "This package is very important to my fiance and it is important that it is delivered very fast.",
    dispatchDate: "2025-06-10 20:36:10",
    expectedDate: "2025-06-15 18:00:00",
    sender: {
      fullName: "Ryan Paevey",
      country: "United States",
      email: "ryanpaeve7@gmail.com",
      phone: "+13034751783",
    },
    receiver: {
      fullName: "Cynthia Jo Jackson",
      country: "United States",
      email: "sweetcynthiajo@gmail.com",
      phone: "+12103767600",
    },
    map: { lat: 51.253775, lng: -85.323214, destinationLat: 29.2908, destinationLng: -98.7831 },
  },
  {
    id: 9,
    trackingId: "YTRT3GE5FC",
    status: "intransit",
    pickup: "Markgrafenstr. 67, 10969 Berlin",
    destination: "130 Illig Dr. Hookstown, PA 15050, United State",
    currentLocation: "Torres Novas, Portugal",
    type: "Security Safe Box",
    price: "$3,167.20",
    paymentMethod: "Cash",
    width: "20 inches wide",
    height: "12 inches high",
    length: "19 inches long",
    weight: "139kg",
    packageName: "Classified",
    comment:
      "This package is very important to my fiance and it is important that it is delivered very fast.",
    dispatchDate: "2025-06-23 20:36:10",
    expectedDate: "2025-06-28 18:00:00",
    sender: {
      fullName: "Ryan Scott",
      country: "Germany",
      email: "ryan@gmail.pivate",
      phone: "+39034751783",
    },
    receiver: {
      fullName: "Roberta Lydick",
      country: "United States",
      email: "ladyfarmer1@comcast.net",
      phone: "+17245619714",
    },
    map: { lat: 39.478568, lng: -8.539313, destinationLat: 40.6892, destinationLng: -80.3814 },
  },
  {
    id: 10,
    trackingId: "FRANE12WSU",
    status: "nearby",
    pickup: "1900 Sacramento St, Los Angeles, CA 90021-1609",
    destination: "Eadie street nr 4 Klein Windhoek Windhoek Namibia",
    currentLocation: "Walvis Bay, Namibia",
    type: "Package",
    price: "$650",
    paymentMethod: "Cash",
    width: "7 inches wide",
    height: "10 inches high",
    length: "9 inches long",
    weight: "13kg",
    packageName: "Classified",
    comment: "This package needs to be delivered to Miss Frances Heydenrych.",
    dispatchDate: "2025-06-24 14:36:10",
    expectedDate: "2025-07-02 18:00:00",
    sender: {
      fullName: "Martin Henderson",
      country: "United States",
      email: "martinhenderson@official.private",
      phone: "7010000000",
    },
    receiver: {
      fullName: "Frances Heydenrych",
      country: "Namibia",
      email: "heydenrychf1@gmail.com",
      phone: "+264812726902",
    },
    map: { lat: -22.956795, lng: 14.507926, destinationLat: -22.57, destinationLng: 17.0832 },
  },
];

export function getTrackingRecord(trackingId: string) {
  return trackingRecords.find(
    (record) => record.trackingId.toUpperCase() === trackingId.toUpperCase(),
  );
}
