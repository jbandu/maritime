import { PrismaClient, CrewStatus, Rank, ContractStatus, VesselStatus, CertificateStatus, VerificationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("🗑️  Clearing existing data...");
  await prisma.crewContract.deleteMany();
  await prisma.crewCertificate.deleteMany();
  await prisma.crewMaster.deleteMany();
  await prisma.certificateType.deleteMany();
  await prisma.vessel.deleteMany();

  // Seed Certificate Types
  console.log("📜 Creating certificate types...");
  const certificateTypes = [
    // STCW Certificates
    { code: "BST", name: "Basic Safety Training", category: "STCW", validityPeriodMonths: 60, mandatory: true },
    { code: "ARPA", name: "Automatic Radar Plotting Aids", category: "STCW", validityPeriodMonths: 60, mandatory: true },
    { code: "GMDSS", name: "Global Maritime Distress and Safety System", category: "STCW", validityPeriodMonths: 60, mandatory: true },
    { code: "PSCRB", name: "Proficiency in Survival Craft and Rescue Boats", category: "STCW", validityPeriodMonths: 60, mandatory: true },
    { code: "AFF", name: "Advanced Fire Fighting", category: "STCW", validityPeriodMonths: 60, mandatory: true },
    { code: "MFA", name: "Medical First Aid", category: "STCW", validityPeriodMonths: 60, mandatory: true },
    { code: "SSO", name: "Ship Security Officer", category: "STCW", validityPeriodMonths: 60, mandatory: false },
    
    // Certificates of Competency
    { code: "COC-MASTER", name: "Certificate of Competency - Master", category: "Competency", validityPeriodMonths: null, mandatory: true },
    { code: "COC-CHIEF-ENG", name: "Certificate of Competency - Chief Engineer", category: "Competency", validityPeriodMonths: null, mandatory: true },
    { code: "COC-CHIEF-OFF", name: "Certificate of Competency - Chief Officer", category: "Competency", validityPeriodMonths: null, mandatory: true },
    { code: "COC-2ND-OFF", name: "Certificate of Competency - Second Officer", category: "Competency", validityPeriodMonths: null, mandatory: true },
    { code: "COC-3RD-OFF", name: "Certificate of Competency - Third Officer", category: "Competency", validityPeriodMonths: null, mandatory: true },
    
    // Medical Certificates
    { code: "MED-FIT", name: "Medical Fitness Certificate", category: "Medical", validityPeriodMonths: 24, mandatory: true },
    
    // Travel Documents
    { code: "PASSPORT", name: "Passport", category: "Travel", validityPeriodMonths: null, mandatory: true },
    { code: "SEAMANS-BOOK", name: "Seaman's Book", category: "Travel", validityPeriodMonths: null, mandatory: true },
    
    // Tanker Endorsements
    { code: "TANKER-OIL", name: "Tanker Endorsement - Oil", category: "Tanker", validityPeriodMonths: 60, mandatory: false },
    { code: "TANKER-CHEM", name: "Tanker Endorsement - Chemical", category: "Tanker", validityPeriodMonths: 60, mandatory: false },
    { code: "TANKER-GAS", name: "Tanker Endorsement - Gas", category: "Tanker", validityPeriodMonths: 60, mandatory: false },
    
    // Security Training
    { code: "ISPS", name: "ISPS Security Training", category: "Security", validityPeriodMonths: 60, mandatory: true },
  ];

  for (const certType of certificateTypes) {
    await prisma.certificateType.upsert({
      where: { code: certType.code },
      update: certType,
      create: certType,
    });
  }

  console.log(`✅ Created ${certificateTypes.length} certificate types`);

  // Seed Vessels
  console.log("🚢 Creating vessels...");
  const vessels = [
    {
      imoNumber: "IMO1234567",
      vesselName: "MV Ocean Star",
      vesselType: "Container Ship",
      flagState: "Panama",
      grossTonnage: 45000,
      operationalStatus: VesselStatus.operational,
    },
    {
      imoNumber: "IMO2345678",
      vesselName: "MV Sea Breeze",
      vesselType: "Tanker",
      flagState: "Liberia",
      grossTonnage: 85000,
      operationalStatus: VesselStatus.operational,
    },
    {
      imoNumber: "IMO3456789",
      vesselName: "MV Cargo Express",
      vesselType: "Bulk Carrier",
      flagState: "Marshall Islands",
      grossTonnage: 65000,
      operationalStatus: VesselStatus.operational,
    },
    {
      imoNumber: "IMO4567890",
      vesselName: "MV Horizon",
      vesselType: "Container Ship",
      flagState: "Singapore",
      grossTonnage: 120000,
      operationalStatus: VesselStatus.operational,
    },
    {
      imoNumber: "IMO5678901",
      vesselName: "MV Pacific Wave",
      vesselType: "Tanker",
      flagState: "Cyprus",
      grossTonnage: 95000,
      operationalStatus: VesselStatus.operational,
    },
  ];

  for (const vessel of vessels) {
    await prisma.vessel.upsert({
      where: { imoNumber: vessel.imoNumber },
      update: vessel,
      create: vessel,
    });
  }

  console.log(`✅ Created ${vessels.length} vessels`);

  // Seed Crew Members
  console.log("👥 Creating crew members...");
  const crewMembers = [
    {
      employeeId: "EMP001",
      firstName: "Juan",
      lastName: "Dela Cruz",
      dateOfBirth: new Date("1980-05-15"),
      nationality: "Philippines",
      email: "juan.delacruz@example.com",
      phone: "+63 912 345 6789",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP002",
      firstName: "Rajesh",
      lastName: "Kumar",
      dateOfBirth: new Date("1985-08-22"),
      nationality: "India",
      email: "rajesh.kumar@example.com",
      phone: "+91 98765 43210",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP003",
      firstName: "Oleksandr",
      lastName: "Petrov",
      dateOfBirth: new Date("1982-03-10"),
      nationality: "Ukraine",
      email: "oleksandr.petrov@example.com",
      phone: "+380 50 123 4567",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP004",
      firstName: "Piotr",
      lastName: "Nowak",
      dateOfBirth: new Date("1978-11-30"),
      nationality: "Poland",
      email: "piotr.nowak@example.com",
      phone: "+48 601 234 567",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP005",
      firstName: "Ivan",
      lastName: "Horvat",
      dateOfBirth: new Date("1983-07-18"),
      nationality: "Croatia",
      email: "ivan.horvat@example.com",
      phone: "+385 91 234 5678",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP006",
      firstName: "Maria",
      lastName: "Santos",
      dateOfBirth: new Date("1990-02-14"),
      nationality: "Philippines",
      email: "maria.santos@example.com",
      phone: "+63 917 654 3210",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP007",
      firstName: "Vikram",
      lastName: "Sharma",
      dateOfBirth: new Date("1987-09-25"),
      nationality: "India",
      email: "vikram.sharma@example.com",
      phone: "+91 98765 12345",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP008",
      firstName: "Andriy",
      lastName: "Kovalenko",
      dateOfBirth: new Date("1981-12-05"),
      nationality: "Ukraine",
      email: "andriy.kovalenko@example.com",
      phone: "+380 67 890 1234",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP009",
      firstName: "Krzysztof",
      lastName: "Wojcik",
      dateOfBirth: new Date("1979-04-20"),
      nationality: "Poland",
      email: "krzysztof.wojcik@example.com",
      phone: "+48 602 345 678",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP010",
      firstName: "Marko",
      lastName: "Babic",
      dateOfBirth: new Date("1984-06-12"),
      nationality: "Croatia",
      email: "marko.babic@example.com",
      phone: "+385 98 765 4321",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP011",
      firstName: "Carlos",
      lastName: "Reyes",
      dateOfBirth: new Date("1986-01-28"),
      nationality: "Philippines",
      email: "carlos.reyes@example.com",
      phone: "+63 918 765 4321",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP012",
      firstName: "Amit",
      lastName: "Patel",
      dateOfBirth: new Date("1988-10-15"),
      nationality: "India",
      email: "amit.patel@example.com",
      phone: "+91 98765 67890",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP013",
      firstName: "Mykhailo",
      lastName: "Shevchenko",
      dateOfBirth: new Date("1982-08-08"),
      nationality: "Ukraine",
      email: "mykhailo.shevchenko@example.com",
      phone: "+380 63 456 7890",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP014",
      firstName: "Tomasz",
      lastName: "Kowalski",
      dateOfBirth: new Date("1980-03-22"),
      nationality: "Poland",
      email: "tomasz.kowalski@example.com",
      phone: "+48 603 456 789",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP015",
      firstName: "Josip",
      lastName: "Maric",
      dateOfBirth: new Date("1985-05-17"),
      nationality: "Croatia",
      email: "josip.maric@example.com",
      phone: "+385 99 123 4567",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP016",
      firstName: "Roberto",
      lastName: "Garcia",
      dateOfBirth: new Date("1989-07-03"),
      nationality: "Philippines",
      email: "roberto.garcia@example.com",
      phone: "+63 919 876 5432",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP017",
      firstName: "Deepak",
      lastName: "Singh",
      dateOfBirth: new Date("1983-11-19"),
      nationality: "India",
      email: "deepak.singh@example.com",
      phone: "+91 98765 23456",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP018",
      firstName: "Serhiy",
      lastName: "Melnyk",
      dateOfBirth: new Date("1981-09-11"),
      nationality: "Ukraine",
      email: "serhiy.melnyk@example.com",
      phone: "+380 50 789 0123",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP019",
      firstName: "Marcin",
      lastName: "Lewandowski",
      dateOfBirth: new Date("1977-12-28"),
      nationality: "Poland",
      email: "marcin.lewandowski@example.com",
      phone: "+48 604 567 890",
      status: CrewStatus.active,
    },
    {
      employeeId: "EMP020",
      firstName: "Luka",
      lastName: "Juric",
      dateOfBirth: new Date("1986-04-09"),
      nationality: "Croatia",
      email: "luka.juric@example.com",
      phone: "+385 95 234 5678",
      status: CrewStatus.active,
    },
  ];

  const createdCrew = [];
  for (const crew of crewMembers) {
    const created = await prisma.crewMaster.upsert({
      where: { employeeId: crew.employeeId },
      update: crew,
      create: crew,
    });
    createdCrew.push(created);
  }

  console.log(`✅ Created ${createdCrew.length} crew members`);

  // Seed Certificates
  console.log("📋 Creating certificates...");
  const certificateTypesData = await prisma.certificateType.findMany();
  const certTypeMap = new Map(certificateTypesData.map((ct) => [ct.code, ct]));

  const now = new Date();
  const certificates = [];

  for (let i = 0; i < createdCrew.length; i++) {
    const crew = createdCrew[i];
    
    // Each crew member gets a set of certificates
    const crewCerts = [
      {
        crewId: crew.id,
        certificateTypeId: certTypeMap.get("BST")!.id,
        certificateNumber: `BST-${crew.employeeId}-2023`,
        issueDate: new Date(now.getFullYear() - 2, 0, 1),
        expiryDate: new Date(now.getFullYear() + 3, 0, 1),
        status: CertificateStatus.valid,
        verificationStatus: VerificationStatus.verified,
      },
      {
        crewId: crew.id,
        certificateTypeId: certTypeMap.get("MED-FIT")!.id,
        certificateNumber: `MED-${crew.employeeId}-2024`,
        issueDate: new Date(now.getFullYear() - 1, 6, 1),
        expiryDate: new Date(now.getFullYear() + 1, 6, 1),
        status: CertificateStatus.valid,
        verificationStatus: VerificationStatus.verified,
      },
      {
        crewId: crew.id,
        certificateTypeId: certTypeMap.get("PASSPORT")!.id,
        certificateNumber: `PASS-${crew.employeeId}`,
        issueDate: new Date(now.getFullYear() - 3, 0, 1),
        expiryDate: new Date(now.getFullYear() + 7, 0, 1),
        status: CertificateStatus.valid,
        verificationStatus: VerificationStatus.verified,
      },
      {
        crewId: crew.id,
        certificateTypeId: certTypeMap.get("SEAMANS-BOOK")!.id,
        certificateNumber: `SB-${crew.employeeId}`,
        issueDate: new Date(now.getFullYear() - 2, 0, 1),
        expiryDate: new Date(now.getFullYear() + 8, 0, 1),
        status: CertificateStatus.valid,
        verificationStatus: VerificationStatus.verified,
      },
    ];

    // Add expiring certificate for some crew (within 30 days)
    if (i < 5) {
      crewCerts.push({
        crewId: crew.id,
        certificateTypeId: certTypeMap.get("ARPA")!.id,
        certificateNumber: `ARPA-${crew.employeeId}-2020`,
        issueDate: new Date(now.getFullYear() - 5, 0, 1),
        expiryDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        status: CertificateStatus.expiring_soon,
        verificationStatus: VerificationStatus.verified,
      });
    }

    // Add expired certificate for some crew
    if (i >= 5 && i < 10) {
      crewCerts.push({
        crewId: crew.id,
        certificateTypeId: certTypeMap.get("GMDSS")!.id,
        certificateNumber: `GMDSS-${crew.employeeId}-2019`,
        issueDate: new Date(now.getFullYear() - 6, 0, 1),
        expiryDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        status: CertificateStatus.expired,
        verificationStatus: VerificationStatus.verified,
      });
    }

    certificates.push(...crewCerts);
  }

  for (const cert of certificates) {
    await prisma.crewCertificate.create({
      data: cert,
    });
  }

  console.log(`✅ Created ${certificates.length} certificates`);

  // Seed Contracts
  console.log("📝 Creating contracts...");
  const vesselsData = await prisma.vessel.findMany();
  
  const contracts = [];
  for (let i = 0; i < Math.min(10, createdCrew.length); i++) {
    const crew = createdCrew[i];
    const vessel = vesselsData[i % vesselsData.length];
    
    const ranks = [
      Rank.master,
      Rank.chief_engineer,
      Rank.chief_officer,
      Rank.second_officer,
      Rank.third_officer,
      Rank.able_seaman,
      Rank.oiler,
      Rank.cook,
      Rank.steward,
      Rank.cadet,
    ];

    contracts.push({
      crewId: crew.id,
      vesselId: vessel.id,
      rank: ranks[i % ranks.length],
      signOnDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
      contractEndDate: new Date(now.getFullYear(), now.getMonth() + 4, 1),
      status: ContractStatus.active,
      basicWage: 2000 + (i * 500),
    });
  }

  for (const contract of contracts) {
    await prisma.crewContract.create({
      data: contract,
    });
  }

  console.log(`✅ Created ${contracts.length} contracts`);

  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
