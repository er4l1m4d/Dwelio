export type Neighbourhood = {
  name: string;
  vibe: "Quiet & Residential" | "Busy & Commercial" | "Student-Friendly" | "Premium";
  description: string;
  landmarks: string[];
  rent: {
    oneBed: string;
    twoBed: string;
    threeBed: string;
  };
};

export const ibadanNeighbourhoods: Neighbourhood[] = [
  {
    name: "Bodija",
    vibe: "Quiet & Residential",
    description:
      "Leafy streets with a mix of family homes and modern flats close to Bodija market.",
    landmarks: ["Bodija Market", "UI Campus", "Agodi GRA"],
    rent: {
      oneBed: "₦450k–₦700k",
      twoBed: "₦700k–₦1.1m",
      threeBed: "₦1.2m–₦1.8m",
    },
  },
  {
    name: "Samonda",
    vibe: "Student-Friendly",
    description:
      "Popular with students and young professionals, lively and close to nightlife.",
    landmarks: ["UI Campus", "Samonda Junction", "Agbowo"],
    rent: {
      oneBed: "₦350k–₦550k",
      twoBed: "₦600k–₦900k",
      threeBed: "₦950k–₦1.3m",
    },
  },
  {
    name: "Agodi GRA",
    vibe: "Premium",
    description:
      "Premium government-reserved area with gated estates and strong security.",
    landmarks: ["Agodi Gardens", "State Secretariat", "Trans Amusement Park"],
    rent: {
      oneBed: "₦600k–₦900k",
      twoBed: "₦1.1m–₦1.8m",
      threeBed: "₦1.9m–₦3.0m",
    },
  },
  {
    name: "Mokola",
    vibe: "Busy & Commercial",
    description:
      "Bustling commercial hub with easy transport and a wide range of housing.",
    landmarks: ["Mokola Roundabout", "Challenge", "Dugbe"],
    rent: {
      oneBed: "₦250k–₦450k",
      twoBed: "₦450k–₦750k",
      threeBed: "₦800k–₦1.2m",
    },
  },
  {
    name: "Ajibode",
    vibe: "Student-Friendly",
    description:
      "Student-heavy community near UI with affordable rooms and shared housing.",
    landmarks: ["UI Campus", "River view", "Agbowo"],
    rent: {
      oneBed: "₦180k–₦350k",
      twoBed: "₦350k–₦600k",
      threeBed: "₦650k–₦900k",
    },
  },
  {
    name: "Agbowo",
    vibe: "Student-Friendly",
    description:
      "High-density student area with constant demand and plenty of rentals.",
    landmarks: ["UI Campus", "Agbowo Gate", "Samonda"],
    rent: {
      oneBed: "₦200k–₦380k",
      twoBed: "₦380k–₦650k",
      threeBed: "₦700k–₦950k",
    },
  },
  {
    name: "Challenge",
    vibe: "Busy & Commercial",
    description:
      "Transit-heavy district with strong commercial activity and affordable rentals.",
    landmarks: ["Challenge Roundabout", "Ring Road", "Dugbe"],
    rent: {
      oneBed: "₦230k–₦400k",
      twoBed: "₦400k–₦700k",
      threeBed: "₦750k–₦1.1m",
    },
  },
  {
    name: "Dugbe",
    vibe: "Busy & Commercial",
    description:
      "Core commercial district with shopping hubs and easy transport links.",
    landmarks: ["Dugbe Market", "Cocoa House", "Ring Road"],
    rent: {
      oneBed: "₦250k–₦450k",
      twoBed: "₦450k–₦800k",
      threeBed: "₦850k–₦1.3m",
    },
  },
  {
    name: "Iwo Road",
    vibe: "Busy & Commercial",
    description:
      "Major transit corridor with mixed residential blocks and affordable rents.",
    landmarks: ["Iwo Road Interchange", "Ojoo", "Mokola"],
    rent: {
      oneBed: "₦220k–₦380k",
      twoBed: "₦380k–₦650k",
      threeBed: "₦700k–₦1.0m",
    },
  },
  {
    name: "New Bodija",
    vibe: "Quiet & Residential",
    description:
      "Upscale residential extension with newer flats and calm streets.",
    landmarks: ["Bodija Market", "Agodi GRA", "UI Campus"],
    rent: {
      oneBed: "₦500k–₦750k",
      twoBed: "₦800k–₦1.3m",
      threeBed: "₦1.4m–₦2.2m",
    },
  },
];
