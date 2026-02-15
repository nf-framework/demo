/* Auto-generated from /portal/data/*.json for portal module in-memory forms */
export const cloneRows = (rows) => JSON.parse(JSON.stringify(Array.isArray(rows) ? rows : []));

export const absences = [
  {
    "id": "abs-001",
    "employeeId": "emp-012",
    "type": "vacation",
    "startDate": "2026-02-14",
    "endDate": "2026-02-20",
    "approvalStatus": "approved",
    "visibility": "team"
  },
  {
    "id": "abs-002",
    "employeeId": "emp-018",
    "type": "trip",
    "startDate": "2026-02-15",
    "endDate": "2026-02-17",
    "approvalStatus": "approved",
    "visibility": "company"
  },
  {
    "id": "abs-003",
    "employeeId": "emp-029",
    "type": "sick",
    "startDate": "2026-02-15",
    "endDate": "2026-02-16",
    "approvalStatus": "approved",
    "visibility": "team"
  },
  {
    "id": "abs-004",
    "employeeId": "emp-021",
    "type": "remote",
    "startDate": "2026-02-15",
    "endDate": "2026-02-15",
    "approvalStatus": "planned",
    "visibility": "team"
  },
  {
    "id": "abs-005",
    "employeeId": "emp-015",
    "type": "vacation",
    "startDate": "2026-02-25",
    "endDate": "2026-03-04",
    "approvalStatus": "approved",
    "visibility": "team"
  },
  {
    "id": "abs-006",
    "employeeId": "emp-016",
    "type": "dayOff",
    "startDate": "2026-02-08",
    "endDate": "2026-02-08",
    "approvalStatus": "approved",
    "visibility": "team"
  },
  {
    "id": "abs-007",
    "employeeId": "emp-032",
    "type": "unpaid",
    "startDate": "2026-02-18",
    "endDate": "2026-02-19",
    "approvalStatus": "planned",
    "visibility": "private"
  },
  {
    "id": "abs-008",
    "employeeId": "emp-013",
    "type": "trip",
    "startDate": "2026-02-11",
    "endDate": "2026-02-13",
    "approvalStatus": "approved",
    "visibility": "company"
  }
];

export const assignments = [
  {
    "id": "asn-001",
    "employeeId": "emp-001",
    "entityType": "project",
    "entityId": "prj-luch",
    "roleId": "role-pm",
    "allocationPercent": 50,
    "validFrom": "2025-11-18",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-002",
    "employeeId": "emp-001",
    "entityType": "product",
    "entityId": "prd-sfera",
    "roleId": "role-qa",
    "allocationPercent": 40,
    "validFrom": "2025-12-19",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-008",
    "notes": ""
  },
  {
    "id": "asn-003",
    "employeeId": "emp-002",
    "entityType": "project",
    "entityId": "prj-zaslon",
    "roleId": "role-se",
    "allocationPercent": 70,
    "validFrom": "2025-11-20",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-011",
    "notes": ""
  },
  {
    "id": "asn-004",
    "employeeId": "emp-002",
    "entityType": "product",
    "entityId": "prd-vektor",
    "roleId": "role-ux",
    "allocationPercent": 30,
    "validFrom": "2025-12-21",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-005",
    "employeeId": "emp-003",
    "entityType": "project",
    "entityId": "prj-ritm",
    "roleId": "role-da",
    "allocationPercent": 50,
    "validFrom": "2025-11-22",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-006",
    "notes": ""
  },
  {
    "id": "asn-006",
    "employeeId": "emp-003",
    "entityType": "product",
    "entityId": "prd-atlas",
    "roleId": "role-po",
    "allocationPercent": 20,
    "validFrom": "2025-12-23",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-003",
    "notes": ""
  },
  {
    "id": "asn-007",
    "employeeId": "emp-004",
    "entityType": "project",
    "entityId": "prj-luch",
    "roleId": "role-arch",
    "allocationPercent": 70,
    "validFrom": "2025-11-24",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-008",
    "employeeId": "emp-004",
    "entityType": "product",
    "entityId": "prd-sfera",
    "roleId": "role-tl",
    "allocationPercent": 40,
    "validFrom": "2025-12-25",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-008",
    "notes": ""
  },
  {
    "id": "asn-009",
    "employeeId": "emp-005",
    "entityType": "project",
    "entityId": "prj-zaslon",
    "roleId": "role-pm",
    "allocationPercent": 50,
    "validFrom": "2025-11-26",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-011",
    "notes": ""
  },
  {
    "id": "asn-010",
    "employeeId": "emp-005",
    "entityType": "product",
    "entityId": "prd-vektor",
    "roleId": "role-qa",
    "allocationPercent": 30,
    "validFrom": "2025-12-27",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-011",
    "employeeId": "emp-006",
    "entityType": "project",
    "entityId": "prj-ritm",
    "roleId": "role-se",
    "allocationPercent": 70,
    "validFrom": "2025-11-28",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-006",
    "notes": ""
  },
  {
    "id": "asn-012",
    "employeeId": "emp-006",
    "entityType": "product",
    "entityId": "prd-atlas",
    "roleId": "role-ux",
    "allocationPercent": 20,
    "validFrom": "2025-12-29",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-003",
    "notes": ""
  },
  {
    "id": "asn-013",
    "employeeId": "emp-007",
    "entityType": "project",
    "entityId": "prj-luch",
    "roleId": "role-da",
    "allocationPercent": 50,
    "validFrom": "2025-11-30",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-014",
    "employeeId": "emp-007",
    "entityType": "product",
    "entityId": "prd-sfera",
    "roleId": "role-po",
    "allocationPercent": 40,
    "validFrom": "2025-12-31",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-008",
    "notes": ""
  },
  {
    "id": "asn-015",
    "employeeId": "emp-008",
    "entityType": "project",
    "entityId": "prj-zaslon",
    "roleId": "role-arch",
    "allocationPercent": 70,
    "validFrom": "2025-12-02",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-011",
    "notes": ""
  },
  {
    "id": "asn-016",
    "employeeId": "emp-008",
    "entityType": "product",
    "entityId": "prd-vektor",
    "roleId": "role-tl",
    "allocationPercent": 30,
    "validFrom": "2025-12-18",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-017",
    "employeeId": "emp-009",
    "entityType": "project",
    "entityId": "prj-ritm",
    "roleId": "role-pm",
    "allocationPercent": 50,
    "validFrom": "2025-12-04",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-006",
    "notes": ""
  },
  {
    "id": "asn-018",
    "employeeId": "emp-009",
    "entityType": "product",
    "entityId": "prd-atlas",
    "roleId": "role-qa",
    "allocationPercent": 20,
    "validFrom": "2025-12-20",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-003",
    "notes": ""
  },
  {
    "id": "asn-019",
    "employeeId": "emp-010",
    "entityType": "project",
    "entityId": "prj-luch",
    "roleId": "role-se",
    "allocationPercent": 70,
    "validFrom": "2025-12-06",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-020",
    "employeeId": "emp-010",
    "entityType": "product",
    "entityId": "prd-sfera",
    "roleId": "role-ux",
    "allocationPercent": 40,
    "validFrom": "2025-12-22",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-008",
    "notes": ""
  },
  {
    "id": "asn-021",
    "employeeId": "emp-011",
    "entityType": "project",
    "entityId": "prj-zaslon",
    "roleId": "role-da",
    "allocationPercent": 50,
    "validFrom": "2025-11-18",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-011",
    "notes": ""
  },
  {
    "id": "asn-022",
    "employeeId": "emp-011",
    "entityType": "product",
    "entityId": "prd-vektor",
    "roleId": "role-po",
    "allocationPercent": 30,
    "validFrom": "2025-12-24",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-023",
    "employeeId": "emp-012",
    "entityType": "project",
    "entityId": "prj-ritm",
    "roleId": "role-arch",
    "allocationPercent": 70,
    "validFrom": "2025-11-20",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-006",
    "notes": ""
  },
  {
    "id": "asn-024",
    "employeeId": "emp-012",
    "entityType": "product",
    "entityId": "prd-atlas",
    "roleId": "role-tl",
    "allocationPercent": 20,
    "validFrom": "2025-12-26",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-003",
    "notes": ""
  },
  {
    "id": "asn-025",
    "employeeId": "emp-013",
    "entityType": "project",
    "entityId": "prj-luch",
    "roleId": "role-pm",
    "allocationPercent": 50,
    "validFrom": "2025-11-22",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-026",
    "employeeId": "emp-013",
    "entityType": "product",
    "entityId": "prd-sfera",
    "roleId": "role-qa",
    "allocationPercent": 40,
    "validFrom": "2025-12-28",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-008",
    "notes": ""
  },
  {
    "id": "asn-027",
    "employeeId": "emp-014",
    "entityType": "project",
    "entityId": "prj-zaslon",
    "roleId": "role-se",
    "allocationPercent": 70,
    "validFrom": "2025-11-24",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-011",
    "notes": ""
  },
  {
    "id": "asn-028",
    "employeeId": "emp-014",
    "entityType": "product",
    "entityId": "prd-vektor",
    "roleId": "role-ux",
    "allocationPercent": 30,
    "validFrom": "2025-12-30",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-029",
    "employeeId": "emp-015",
    "entityType": "project",
    "entityId": "prj-ritm",
    "roleId": "role-da",
    "allocationPercent": 50,
    "validFrom": "2025-11-26",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-006",
    "notes": ""
  },
  {
    "id": "asn-030",
    "employeeId": "emp-015",
    "entityType": "product",
    "entityId": "prd-atlas",
    "roleId": "role-po",
    "allocationPercent": 20,
    "validFrom": "2025-12-17",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-003",
    "notes": ""
  },
  {
    "id": "asn-031",
    "employeeId": "emp-016",
    "entityType": "project",
    "entityId": "prj-luch",
    "roleId": "role-arch",
    "allocationPercent": 70,
    "validFrom": "2025-11-28",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-032",
    "employeeId": "emp-016",
    "entityType": "product",
    "entityId": "prd-sfera",
    "roleId": "role-tl",
    "allocationPercent": 40,
    "validFrom": "2025-12-19",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-008",
    "notes": ""
  },
  {
    "id": "asn-033",
    "employeeId": "emp-017",
    "entityType": "project",
    "entityId": "prj-zaslon",
    "roleId": "role-pm",
    "allocationPercent": 50,
    "validFrom": "2025-11-30",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-011",
    "notes": ""
  },
  {
    "id": "asn-034",
    "employeeId": "emp-017",
    "entityType": "product",
    "entityId": "prd-vektor",
    "roleId": "role-qa",
    "allocationPercent": 30,
    "validFrom": "2025-12-21",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-035",
    "employeeId": "emp-018",
    "entityType": "project",
    "entityId": "prj-ritm",
    "roleId": "role-se",
    "allocationPercent": 70,
    "validFrom": "2025-12-02",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-006",
    "notes": ""
  },
  {
    "id": "asn-036",
    "employeeId": "emp-018",
    "entityType": "product",
    "entityId": "prd-atlas",
    "roleId": "role-ux",
    "allocationPercent": 20,
    "validFrom": "2025-12-23",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-003",
    "notes": ""
  },
  {
    "id": "asn-037",
    "employeeId": "emp-019",
    "entityType": "project",
    "entityId": "prj-luch",
    "roleId": "role-da",
    "allocationPercent": 50,
    "validFrom": "2025-12-04",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-038",
    "employeeId": "emp-019",
    "entityType": "product",
    "entityId": "prd-sfera",
    "roleId": "role-po",
    "allocationPercent": 40,
    "validFrom": "2025-12-25",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-008",
    "notes": ""
  },
  {
    "id": "asn-039",
    "employeeId": "emp-020",
    "entityType": "project",
    "entityId": "prj-zaslon",
    "roleId": "role-arch",
    "allocationPercent": 70,
    "validFrom": "2025-12-06",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-011",
    "notes": ""
  },
  {
    "id": "asn-040",
    "employeeId": "emp-020",
    "entityType": "product",
    "entityId": "prd-vektor",
    "roleId": "role-tl",
    "allocationPercent": 30,
    "validFrom": "2025-12-27",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-041",
    "employeeId": "emp-021",
    "entityType": "project",
    "entityId": "prj-ritm",
    "roleId": "role-pm",
    "allocationPercent": 50,
    "validFrom": "2025-11-18",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-006",
    "notes": ""
  },
  {
    "id": "asn-042",
    "employeeId": "emp-021",
    "entityType": "product",
    "entityId": "prd-atlas",
    "roleId": "role-qa",
    "allocationPercent": 20,
    "validFrom": "2025-12-29",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-003",
    "notes": ""
  },
  {
    "id": "asn-043",
    "employeeId": "emp-022",
    "entityType": "project",
    "entityId": "prj-luch",
    "roleId": "role-se",
    "allocationPercent": 70,
    "validFrom": "2025-11-20",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-044",
    "employeeId": "emp-022",
    "entityType": "product",
    "entityId": "prd-sfera",
    "roleId": "role-ux",
    "allocationPercent": 40,
    "validFrom": "2025-12-31",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-008",
    "notes": ""
  },
  {
    "id": "asn-045",
    "employeeId": "emp-023",
    "entityType": "project",
    "entityId": "prj-zaslon",
    "roleId": "role-da",
    "allocationPercent": 50,
    "validFrom": "2025-11-22",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-011",
    "notes": ""
  },
  {
    "id": "asn-046",
    "employeeId": "emp-023",
    "entityType": "product",
    "entityId": "prd-vektor",
    "roleId": "role-po",
    "allocationPercent": 30,
    "validFrom": "2025-12-18",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-047",
    "employeeId": "emp-024",
    "entityType": "project",
    "entityId": "prj-ritm",
    "roleId": "role-arch",
    "allocationPercent": 70,
    "validFrom": "2025-11-24",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-006",
    "notes": ""
  },
  {
    "id": "asn-048",
    "employeeId": "emp-024",
    "entityType": "product",
    "entityId": "prd-atlas",
    "roleId": "role-tl",
    "allocationPercent": 20,
    "validFrom": "2025-12-20",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-003",
    "notes": ""
  },
  {
    "id": "asn-049",
    "employeeId": "emp-025",
    "entityType": "project",
    "entityId": "prj-luch",
    "roleId": "role-pm",
    "allocationPercent": 50,
    "validFrom": "2025-11-26",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-050",
    "employeeId": "emp-025",
    "entityType": "product",
    "entityId": "prd-sfera",
    "roleId": "role-qa",
    "allocationPercent": 40,
    "validFrom": "2025-12-22",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-008",
    "notes": ""
  },
  {
    "id": "asn-051",
    "employeeId": "emp-026",
    "entityType": "project",
    "entityId": "prj-zaslon",
    "roleId": "role-se",
    "allocationPercent": 70,
    "validFrom": "2025-11-28",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-011",
    "notes": ""
  },
  {
    "id": "asn-052",
    "employeeId": "emp-026",
    "entityType": "product",
    "entityId": "prd-vektor",
    "roleId": "role-ux",
    "allocationPercent": 30,
    "validFrom": "2025-12-24",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-053",
    "employeeId": "emp-027",
    "entityType": "project",
    "entityId": "prj-ritm",
    "roleId": "role-da",
    "allocationPercent": 50,
    "validFrom": "2025-11-30",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-006",
    "notes": ""
  },
  {
    "id": "asn-054",
    "employeeId": "emp-027",
    "entityType": "product",
    "entityId": "prd-atlas",
    "roleId": "role-po",
    "allocationPercent": 20,
    "validFrom": "2025-12-26",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-003",
    "notes": ""
  },
  {
    "id": "asn-055",
    "employeeId": "emp-028",
    "entityType": "project",
    "entityId": "prj-luch",
    "roleId": "role-arch",
    "allocationPercent": 70,
    "validFrom": "2025-12-02",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-056",
    "employeeId": "emp-028",
    "entityType": "product",
    "entityId": "prd-sfera",
    "roleId": "role-tl",
    "allocationPercent": 40,
    "validFrom": "2025-12-28",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-008",
    "notes": ""
  },
  {
    "id": "asn-057",
    "employeeId": "emp-029",
    "entityType": "project",
    "entityId": "prj-zaslon",
    "roleId": "role-pm",
    "allocationPercent": 50,
    "validFrom": "2025-12-04",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-011",
    "notes": ""
  },
  {
    "id": "asn-058",
    "employeeId": "emp-029",
    "entityType": "product",
    "entityId": "prd-vektor",
    "roleId": "role-qa",
    "allocationPercent": 30,
    "validFrom": "2025-12-30",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-059",
    "employeeId": "emp-030",
    "entityType": "project",
    "entityId": "prj-ritm",
    "roleId": "role-se",
    "allocationPercent": 70,
    "validFrom": "2025-12-06",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-006",
    "notes": ""
  },
  {
    "id": "asn-060",
    "employeeId": "emp-030",
    "entityType": "product",
    "entityId": "prd-atlas",
    "roleId": "role-ux",
    "allocationPercent": 20,
    "validFrom": "2025-12-17",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-003",
    "notes": ""
  },
  {
    "id": "asn-061",
    "employeeId": "emp-031",
    "entityType": "project",
    "entityId": "prj-luch",
    "roleId": "role-da",
    "allocationPercent": 50,
    "validFrom": "2025-11-18",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  },
  {
    "id": "asn-062",
    "employeeId": "emp-031",
    "entityType": "product",
    "entityId": "prd-sfera",
    "roleId": "role-po",
    "allocationPercent": 40,
    "validFrom": "2025-12-19",
    "validTo": null,
    "lineType": "consult",
    "managerOnProjectId": "emp-008",
    "notes": ""
  },
  {
    "id": "asn-063",
    "employeeId": "emp-032",
    "entityType": "project",
    "entityId": "prj-zaslon",
    "roleId": "role-arch",
    "allocationPercent": 70,
    "validFrom": "2025-11-20",
    "validTo": null,
    "lineType": "core",
    "managerOnProjectId": "emp-011",
    "notes": ""
  },
  {
    "id": "asn-064",
    "employeeId": "emp-032",
    "entityType": "product",
    "entityId": "prd-vektor",
    "roleId": "role-tl",
    "allocationPercent": 30,
    "validFrom": "2025-12-21",
    "validTo": null,
    "lineType": "contributor",
    "managerOnProjectId": "emp-004",
    "notes": ""
  }
];

export const auditLog = [
  {
    "id": "audit-001",
    "entityType": "assignment",
    "entityId": "asn-001",
    "action": "create",
    "before": null,
    "after": {
      "id": "asn-001",
      "employeeId": "emp-001",
      "entityType": "project",
      "entityId": "prj-luch",
      "roleId": "role-pm",
      "allocationPercent": 50,
      "validFrom": "2025-11-18",
      "validTo": null,
      "lineType": "contributor",
      "managerOnProjectId": "emp-004",
      "notes": ""
    },
    "actorId": "system",
    "timestamp": "2026-02-15T08:23:28.892Z"
  },
  {
    "id": "audit-002",
    "entityType": "project",
    "entityId": "prj-kedr",
    "action": "update",
    "before": {
      "status": "onHold"
    },
    "after": {
      "status": "active"
    },
    "actorId": "emp-002",
    "timestamp": "2026-02-15T08:23:28.892Z"
  },
  {
    "id": "audit-003",
    "entityType": "employee",
    "entityId": "emp-029",
    "action": "update",
    "before": {
      "title": "Инженер разработки"
    },
    "after": {
      "title": "Backend инженер"
    },
    "actorId": "emp-010",
    "timestamp": "2026-02-15T08:23:28.892Z"
  },
  {
    "id": "audit-004",
    "entityType": "knowledgeBase",
    "entityId": "kb-002",
    "action": "create",
    "before": null,
    "after": {
      "id": "kb-002",
      "title": "Регламент релизов и изменений",
      "summary": "Порядок релизов, окно выката, ответственность и чек-лист до и после релиза.",
      "contentHtml": "\n      <div class=\"rich-article\">\n        <p class=\"lead\"><strong>Регламент релизов и изменений</strong> устанавливает безопасный цикл выпуска изменений для всех продуктовых контуров.</p>\n        <h3>Этапы релиза</h3>\n        <ol>\n          <li>Подготовка change-заявки и чек-листа рисков.</li>\n          <li>Техническое и операционное согласование.</li>\n          <li>Выкат в окно релиза и пост-контроль метрик.</li>\n        </ol>\n        <table>\n          <thead>\n            <tr><th>Класс изменения</th><th>Согласование</th><th>Окно</th></tr>\n          </thead>\n          <tbody>\n            <tr><td>Стандартное</td><td>Техлид</td><td>Вт/Чт 19:00-21:00</td></tr>\n            <tr><td>Рискованное</td><td>Техлид + Операции</td><td>По отдельному плану</td></tr>\n            <tr><td>Критичное</td><td>CAB</td><td>Аварийное окно</td></tr>\n          </tbody>\n        </table>\n      </div>\n    ",
      "url": "https://intra.portal.local/docs/release-regulation",
      "category": "Регламенты",
      "tags": [
        "релизы",
        "эксплуатация",
        "процессы"
      ],
      "pinned": true,
      "access": {
        "type": "departments",
        "ids": [
          "dep-eng",
          "dep-prod",
          "dep-ops"
        ]
      },
      "departmentIds": [
        "dep-eng",
        "dep-prod",
        "dep-ops"
      ],
      "isRegulation": true,
      "updatedAt": "2026-01-31T08:00:00.000Z",
      "authorId": "emp-002"
    },
    "actorId": "emp-002",
    "timestamp": "2026-02-15T08:23:28.892Z"
  },
  {
    "id": "audit-005",
    "entityType": "documents",
    "entityId": "doc-002",
    "action": "update",
    "before": {
      "status": "inReview"
    },
    "after": {
      "id": "doc-002",
      "title": "Договор на сопровождение платформы бизнес-аналитики",
      "regNumber": "CNT-2026-015",
      "type": "contract",
      "status": "approved",
      "initiatorId": "emp-004",
      "assigneeId": "emp-006",
      "departmentId": "dep-data",
      "dueDate": "2026-02-15",
      "updatedAt": "2026-02-13T10:00:00.000Z",
      "summary": "Договор согласован с юридическим блоком и готов к подписанию со стороны операций.",
      "tags": [
        "договор",
        "аналитика",
        "аутсорс"
      ],
      "isPinned": true,
      "link": "/projects/prj-luch",
      "history": [
        {
          "id": "dh-002-3",
          "fromStatus": "inReview",
          "toStatus": "approved",
          "changedAt": "2026-02-13T10:00:00.000Z",
          "changedById": "emp-006",
          "comment": "Согласовано, ожидается подписание контрагентом."
        },
        {
          "id": "dh-002-2",
          "fromStatus": "draft",
          "toStatus": "inReview",
          "changedAt": "2026-02-11T08:00:00.000Z",
          "changedById": "emp-004",
          "comment": "Передано в юрслужбу и финконтроль."
        },
        {
          "id": "dh-002-1",
          "fromStatus": "",
          "toStatus": "draft",
          "changedAt": "2026-02-09T06:00:00.000Z",
          "changedById": "emp-004",
          "comment": "Заведен новый договор по сервисной поддержке."
        }
      ]
    },
    "actorId": "emp-006",
    "timestamp": "2026-02-15T08:23:28.892Z"
  },
  {
    "id": "audit-006",
    "entityType": "tasks",
    "entityId": "task-002",
    "action": "create",
    "before": null,
    "after": {
      "id": "task-002",
      "title": "Подписать договор сопровождения платформы бизнес-аналитики",
      "description": "Проверить юр-блок и подписать со стороны операций.",
      "status": "todo",
      "priority": "critical",
      "assigneeId": "emp-006",
      "reporterId": "emp-004",
      "dueDate": "2026-02-15",
      "plannedTime": "10:30",
      "estimateMinutes": 30,
      "relatedType": "document",
      "relatedId": "doc-002",
      "updatedAt": "2026-02-14T07:00:00.000Z",
      "isPinned": true,
      "tags": [
        "договор"
      ]
    },
    "actorId": "emp-004",
    "timestamp": "2026-02-15T08:23:28.892Z"
  }
];

export const corporateEvents = [
  {
    "id": "evt-volley-msk",
    "title": "Корпоративный волейбол",
    "type": "sports",
    "city": "Москва",
    "locationId": "loc-msk",
    "venue": "СК Лидер, зал №2",
    "weekday": 3,
    "startTime": "19:30",
    "endTime": "21:00",
    "frequency": "weekly",
    "active": true,
    "audience": "all",
    "description": "Открытая тренировка для всех команд. Уровень: любительский.",
    "registrationEmployeeIds": [
      "emp-001",
      "emp-003",
      "emp-009",
      "emp-013",
      "emp-025"
    ],
    "registeredCount": 19,
    "capacity": 24
  },
  {
    "id": "evt-volley-spb",
    "title": "Корпоративный волейбол",
    "type": "sports",
    "city": "Санкт-Петербург",
    "locationId": "loc-spb",
    "venue": "Спортивный центр «Север», площадка Б",
    "weekday": 3,
    "startTime": "19:00",
    "endTime": "20:30",
    "frequency": "weekly",
    "active": true,
    "audience": "all",
    "description": "Еженедельная игра для сотрудников офиса СПб.",
    "registrationEmployeeIds": [
      "emp-004",
      "emp-010",
      "emp-014",
      "emp-015",
      "emp-022",
      "emp-030"
    ],
    "registeredCount": 16,
    "capacity": 20
  },
  {
    "id": "evt-volley-ekb",
    "title": "Корпоративный волейбол",
    "type": "sports",
    "city": "Екатеринбург",
    "locationId": "loc-ekb",
    "venue": "Спортивный комплекс «Ельцин Центр»",
    "weekday": 3,
    "startTime": "19:00",
    "endTime": "20:30",
    "frequency": "weekly",
    "active": true,
    "audience": "all",
    "description": "Тренировка и мини-турнир между отделами.",
    "registrationEmployeeIds": [
      "emp-006",
      "emp-018",
      "emp-019",
      "emp-027",
      "emp-032"
    ],
    "registeredCount": 14,
    "capacity": 18
  },
  {
    "id": "evt-yoga-msk",
    "title": "Корпоративная йога",
    "type": "wellness",
    "city": "Москва",
    "locationId": "loc-msk",
    "venue": "Зал здоровья, 5 этаж",
    "weekday": 1,
    "startTime": "08:30",
    "endTime": "09:15",
    "frequency": "weekly",
    "active": true,
    "audience": "all",
    "description": "Утренний формат для мягкого старта недели.",
    "registrationEmployeeIds": [
      "emp-002",
      "emp-005",
      "emp-007",
      "emp-016",
      "emp-031"
    ],
    "registeredCount": 12,
    "capacity": 16
  },
  {
    "id": "evt-tech-club-spb",
    "title": "Клуб технологий: доклады и демонстрации",
    "type": "education",
    "city": "Санкт-Петербург",
    "locationId": "loc-spb",
    "venue": "Конференц-зал Нева",
    "weekday": 4,
    "startTime": "18:30",
    "endTime": "20:00",
    "frequency": "biweekly",
    "active": true,
    "audience": "all",
    "description": "Клуб внутренних докладов по продукту и инженерным практикам.",
    "registrationEmployeeIds": [
      "emp-008",
      "emp-014",
      "emp-015",
      "emp-022",
      "emp-026",
      "emp-030"
    ],
    "registeredCount": 22,
    "capacity": 30
  }
];

export const departments = [
  {
    "id": "dep-exec",
    "name": "Руководство",
    "parentId": null,
    "headId": "emp-001",
    "description": "Стратегия и управление компанией",
    "costCenter": "CC-001",
    "legalEntity": "ООО \"Портал\"",
    "links": {
      "knowledgeBaseIds": [
        "kb-001",
        "kb-004"
      ],
      "regulationsPath": "/knowledge?departmentId=dep-exec&isRegulation=true"
    }
  },
  {
    "id": "dep-prod",
    "name": "Продуктовое направление",
    "parentId": "dep-exec",
    "headId": "emp-003",
    "description": "Продуктовая стратегия и дорожная карта",
    "costCenter": "CC-101",
    "legalEntity": "ООО \"Портал\"",
    "links": {
      "knowledgeBaseIds": [
        "kb-001",
        "kb-002",
        "kb-007",
        "kb-011"
      ],
      "regulationsPath": "/knowledge?departmentId=dep-prod&isRegulation=true"
    }
  },
  {
    "id": "dep-eng",
    "name": "Разработка",
    "parentId": "dep-exec",
    "headId": "emp-002",
    "description": "Бэкенд, фронтенд и платформенные сервисы",
    "costCenter": "CC-102",
    "legalEntity": "ООО \"Портал\"",
    "links": {
      "knowledgeBaseIds": [
        "kb-001",
        "kb-002",
        "kb-005",
        "kb-007",
        "kb-009",
        "kb-011"
      ],
      "regulationsPath": "/knowledge?departmentId=dep-eng&isRegulation=true"
    }
  },
  {
    "id": "dep-design",
    "name": "Дизайн",
    "parentId": "dep-prod",
    "headId": "emp-005",
    "description": "Продуктовый дизайн и дизайн-система",
    "costCenter": "CC-103",
    "legalEntity": "ООО \"Портал\"",
    "links": {
      "knowledgeBaseIds": [
        "kb-001",
        "kb-007"
      ],
      "regulationsPath": "/knowledge?departmentId=dep-design&isRegulation=true"
    }
  },
  {
    "id": "dep-data",
    "name": "Данные и аналитика",
    "parentId": "dep-eng",
    "headId": "emp-004",
    "description": "Отчетность, аналитика и модели",
    "costCenter": "CC-104",
    "legalEntity": "ООО \"Портал\"",
    "links": {
      "knowledgeBaseIds": [
        "kb-001",
        "kb-009",
        "kb-011"
      ],
      "regulationsPath": "/knowledge?departmentId=dep-data&isRegulation=true"
    }
  },
  {
    "id": "dep-ops",
    "name": "Операции",
    "parentId": "dep-exec",
    "headId": "emp-006",
    "description": "Сопровождение и поддержка",
    "costCenter": "CC-105",
    "legalEntity": "ООО \"Портал\"",
    "links": {
      "knowledgeBaseIds": [
        "kb-001",
        "kb-002",
        "kb-005"
      ],
      "regulationsPath": "/knowledge?departmentId=dep-ops&isRegulation=true"
    }
  },
  {
    "id": "dep-hr",
    "name": "Кадры и развитие",
    "parentId": "dep-exec",
    "headId": "emp-007",
    "description": "Подбор, адаптация и развитие сотрудников",
    "costCenter": "CC-106",
    "legalEntity": "ООО \"Портал\"",
    "links": {
      "knowledgeBaseIds": [
        "kb-001",
        "kb-004"
      ],
      "regulationsPath": "/knowledge?departmentId=dep-hr&isRegulation=true"
    }
  }
];

export const documents = [
  {
    "id": "doc-001",
    "title": "Приказ о графике отпусков на II квартал",
    "regNumber": "PRK-2026-041",
    "type": "order",
    "status": "inReview",
    "initiatorId": "emp-007",
    "assigneeId": "emp-001",
    "departmentId": "dep-hr",
    "dueDate": "2026-02-16",
    "updatedAt": "2026-02-14T06:00:00.000Z",
    "summary": "Финальное согласование графика отпусков по всем функциям компании.",
    "tags": [
      "кадры",
      "отпуск",
      "планирование"
    ],
    "isPinned": true,
    "link": "/knowledge/kb-012",
    "history": [
      {
        "id": "dh-001-2",
        "fromStatus": "draft",
        "toStatus": "inReview",
        "changedAt": "2026-02-14T06:00:00.000Z",
        "changedById": "emp-007",
        "comment": "Документ передан на согласование руководству."
      },
      {
        "id": "dh-001-1",
        "fromStatus": "",
        "toStatus": "draft",
        "changedAt": "2026-02-12T08:00:00.000Z",
        "changedById": "emp-007",
        "comment": "Создан проект приказа по отпускам."
      }
    ]
  },
  {
    "id": "doc-002",
    "title": "Договор на сопровождение платформы бизнес-аналитики",
    "regNumber": "CNT-2026-015",
    "type": "contract",
    "status": "approved",
    "initiatorId": "emp-004",
    "assigneeId": "emp-006",
    "departmentId": "dep-data",
    "dueDate": "2026-02-15",
    "updatedAt": "2026-02-13T10:00:00.000Z",
    "summary": "Договор согласован с юридическим блоком и готов к подписанию со стороны операций.",
    "tags": [
      "договор",
      "аналитика",
      "аутсорс"
    ],
    "isPinned": true,
    "link": "/projects/prj-luch",
    "history": [
      {
        "id": "dh-002-3",
        "fromStatus": "inReview",
        "toStatus": "approved",
        "changedAt": "2026-02-13T10:00:00.000Z",
        "changedById": "emp-006",
        "comment": "Согласовано, ожидается подписание контрагентом."
      },
      {
        "id": "dh-002-2",
        "fromStatus": "draft",
        "toStatus": "inReview",
        "changedAt": "2026-02-11T08:00:00.000Z",
        "changedById": "emp-004",
        "comment": "Передано в юрслужбу и финконтроль."
      },
      {
        "id": "dh-002-1",
        "fromStatus": "",
        "toStatus": "draft",
        "changedAt": "2026-02-09T06:00:00.000Z",
        "changedById": "emp-004",
        "comment": "Заведен новый договор по сервисной поддержке."
      }
    ]
  },
  {
    "id": "doc-003",
    "title": "Служебная записка по расширению облачной квоты",
    "regNumber": "MEM-2026-073",
    "type": "memo",
    "status": "draft",
    "initiatorId": "emp-002",
    "assigneeId": "emp-001",
    "departmentId": "dep-eng",
    "dueDate": "2026-02-17",
    "updatedAt": "2026-02-14T08:00:00.000Z",
    "summary": "Запрос на увеличение лимита вычислительных мощностей для контуров разработки и тестирования.",
    "tags": [
      "инфраструктура",
      "облако"
    ],
    "isPinned": false,
    "link": "/projects/prj-zaslon",
    "history": [
      {
        "id": "dh-003-1",
        "fromStatus": "",
        "toStatus": "draft",
        "changedAt": "2026-02-14T08:00:00.000Z",
        "changedById": "emp-002",
        "comment": "Черновик записки подготовлен и ожидает внутреннего ревью."
      }
    ]
  },
  {
    "id": "doc-004",
    "title": "Счет на продление лицензий аналитики",
    "regNumber": "INV-2026-228",
    "type": "invoice",
    "status": "inReview",
    "initiatorId": "emp-014",
    "assigneeId": "emp-006",
    "departmentId": "dep-data",
    "dueDate": "2026-02-15",
    "updatedAt": "2026-02-14T13:00:00.000Z",
    "summary": "Проверка бюджета и лимитов перед оплатой.",
    "tags": [
      "бюджет",
      "лицензии",
      "оплата"
    ],
    "isPinned": false,
    "link": "/knowledge/kb-008",
    "history": [
      {
        "id": "dh-004-2",
        "fromStatus": "draft",
        "toStatus": "inReview",
        "changedAt": "2026-02-14T13:00:00.000Z",
        "changedById": "emp-014",
        "comment": "Счет направлен в финансовый контроль."
      },
      {
        "id": "dh-004-1",
        "fromStatus": "",
        "toStatus": "draft",
        "changedAt": "2026-02-13T12:00:00.000Z",
        "changedById": "emp-014",
        "comment": "Создан документ на оплату лицензий."
      }
    ]
  },
  {
    "id": "doc-005",
    "title": "Политика хранения логов приложений",
    "regNumber": "PLC-2026-019",
    "type": "policy",
    "status": "approved",
    "initiatorId": "emp-011",
    "assigneeId": "emp-002",
    "departmentId": "dep-eng",
    "dueDate": "2026-02-18",
    "updatedAt": "2026-02-12T07:00:00.000Z",
    "summary": "Новая редакция политики хранения логов и трассировок для сервисов клиентского контура.",
    "tags": [
      "безопасность",
      "логирование",
      "комплаенс"
    ],
    "isPinned": true,
    "link": "/knowledge/kb-009",
    "history": [
      {
        "id": "dh-005-3",
        "fromStatus": "inReview",
        "toStatus": "approved",
        "changedAt": "2026-02-12T07:00:00.000Z",
        "changedById": "emp-011",
        "comment": "Политика утверждена для публикации."
      },
      {
        "id": "dh-005-2",
        "fromStatus": "draft",
        "toStatus": "inReview",
        "changedAt": "2026-02-10T08:00:00.000Z",
        "changedById": "emp-002",
        "comment": "Передано на согласование в ИБ."
      },
      {
        "id": "dh-005-1",
        "fromStatus": "",
        "toStatus": "draft",
        "changedAt": "2026-02-08T07:00:00.000Z",
        "changedById": "emp-011",
        "comment": "Подготовлена новая редакция политики."
      }
    ]
  },
  {
    "id": "doc-006",
    "title": "Протокол архитектурного комитета",
    "regNumber": "MEM-2026-081",
    "type": "memo",
    "status": "signed",
    "initiatorId": "emp-011",
    "assigneeId": "emp-001",
    "departmentId": "dep-eng",
    "dueDate": "2026-02-14",
    "updatedAt": "2026-02-14T15:00:00.000Z",
    "summary": "Итоги заседания и принятые решения.",
    "tags": [
      "архитектура"
    ],
    "isPinned": false,
    "link": "/knowledge/kb-002",
    "history": [
      {
        "id": "dh-006-3",
        "fromStatus": "approved",
        "toStatus": "signed",
        "changedAt": "2026-02-14T15:00:00.000Z",
        "changedById": "emp-001",
        "comment": "Протокол подписан председателем комитета."
      },
      {
        "id": "dh-006-2",
        "fromStatus": "inReview",
        "toStatus": "approved",
        "changedAt": "2026-02-13T15:00:00.000Z",
        "changedById": "emp-002",
        "comment": "Замечания учтены, документ согласован."
      },
      {
        "id": "dh-006-1",
        "fromStatus": "",
        "toStatus": "inReview",
        "changedAt": "2026-02-12T09:00:00.000Z",
        "changedById": "emp-011",
        "comment": "Протокол отправлен участникам комитета."
      }
    ]
  },
  {
    "id": "doc-007",
    "title": "Заявка на изменение уровней сервиса поддержки",
    "regNumber": "MEM-2026-086",
    "type": "memo",
    "status": "inReview",
    "initiatorId": "emp-006",
    "assigneeId": "emp-018",
    "departmentId": "dep-ops",
    "dueDate": "2026-02-16",
    "updatedAt": "2026-02-14T11:00:00.000Z",
    "summary": "Финализация целевых SLA для сервисов первого и второго уровня поддержки.",
    "tags": [
      "уровни-сервиса",
      "поддержка",
      "процессы"
    ],
    "isPinned": true,
    "link": "/projects/prj-ritm",
    "history": [
      {
        "id": "dh-007-2",
        "fromStatus": "draft",
        "toStatus": "inReview",
        "changedAt": "2026-02-14T11:00:00.000Z",
        "changedById": "emp-006",
        "comment": "Передано в эксплуатацию и продукты для согласования."
      },
      {
        "id": "dh-007-1",
        "fromStatus": "",
        "toStatus": "draft",
        "changedAt": "2026-02-12T06:00:00.000Z",
        "changedById": "emp-006",
        "comment": "Заведена заявка на пересмотр SLA."
      }
    ]
  },
  {
    "id": "doc-008",
    "title": "Акт приемки этапа \"Кедр\"",
    "regNumber": "ACT-2026-033",
    "type": "other",
    "status": "inReview",
    "initiatorId": "emp-002",
    "assigneeId": "emp-003",
    "departmentId": "dep-eng",
    "dueDate": "2026-02-17",
    "updatedAt": "2026-02-13T14:00:00.000Z",
    "summary": "Акт по этапу миграции интерфейса портала и интеграции с HR-модулем.",
    "tags": [
      "акт",
      "портал",
      "релиз"
    ],
    "isPinned": false,
    "link": "/projects/prj-kedr",
    "history": [
      {
        "id": "dh-008-2",
        "fromStatus": "draft",
        "toStatus": "inReview",
        "changedAt": "2026-02-13T14:00:00.000Z",
        "changedById": "emp-002",
        "comment": "Документ отправлен заказчику этапа на приемку."
      },
      {
        "id": "dh-008-1",
        "fromStatus": "",
        "toStatus": "draft",
        "changedAt": "2026-02-11T08:00:00.000Z",
        "changedById": "emp-002",
        "comment": "Подготовлен акт сдачи этапа."
      }
    ]
  },
  {
    "id": "doc-009",
    "title": "Дополнительное соглашение по хостингу мобильного API",
    "regNumber": "CNT-2026-022",
    "type": "contract",
    "status": "signed",
    "initiatorId": "emp-003",
    "assigneeId": "emp-006",
    "departmentId": "dep-prod",
    "dueDate": "2026-02-20",
    "updatedAt": "2026-02-14T16:00:00.000Z",
    "summary": "Допсоглашение по увеличению SLA и резервированию инфраструктуры мобильного API.",
    "tags": [
      "мобильное-приложение",
      "договор",
      "инфраструктура"
    ],
    "isPinned": false,
    "link": "/projects/prj-volna",
    "history": [
      {
        "id": "dh-009-3",
        "fromStatus": "approved",
        "toStatus": "signed",
        "changedAt": "2026-02-14T16:00:00.000Z",
        "changedById": "emp-006",
        "comment": "Документ подписан обеими сторонами."
      },
      {
        "id": "dh-009-2",
        "fromStatus": "inReview",
        "toStatus": "approved",
        "changedAt": "2026-02-13T10:00:00.000Z",
        "changedById": "emp-003",
        "comment": "Юридические замечания закрыты."
      },
      {
        "id": "dh-009-1",
        "fromStatus": "",
        "toStatus": "inReview",
        "changedAt": "2026-02-11T06:00:00.000Z",
        "changedById": "emp-003",
        "comment": "Соглашение направлено на правовую экспертизу."
      }
    ]
  },
  {
    "id": "doc-010",
    "title": "Приказ о составе комиссии по информационной безопасности",
    "regNumber": "PRK-2026-047",
    "type": "order",
    "status": "approved",
    "initiatorId": "emp-011",
    "assigneeId": "emp-001",
    "departmentId": "dep-eng",
    "dueDate": "2026-02-19",
    "updatedAt": "2026-02-13T07:00:00.000Z",
    "summary": "Утверждение состава комиссии по контролю доступа и расследованию инцидентов ИБ.",
    "tags": [
      "иб",
      "комиссия",
      "приказ"
    ],
    "isPinned": true,
    "link": "/knowledge/kb-005",
    "history": [
      {
        "id": "dh-010-2",
        "fromStatus": "inReview",
        "toStatus": "approved",
        "changedAt": "2026-02-13T07:00:00.000Z",
        "changedById": "emp-001",
        "comment": "Состав комиссии утвержден."
      },
      {
        "id": "dh-010-1",
        "fromStatus": "",
        "toStatus": "inReview",
        "changedAt": "2026-02-12T10:00:00.000Z",
        "changedById": "emp-011",
        "comment": "Приказ передан на согласование."
      }
    ]
  },
  {
    "id": "doc-011",
    "title": "Служебная записка на закупку рабочих станций",
    "regNumber": "MEM-2026-094",
    "type": "memo",
    "status": "rejected",
    "initiatorId": "emp-024",
    "assigneeId": "emp-006",
    "departmentId": "dep-eng",
    "dueDate": "2026-02-18",
    "updatedAt": "2026-02-14T05:00:00.000Z",
    "summary": "Запрос на закупку 12 рабочих станций для расширения команды разработки.",
    "tags": [
      "закупка",
      "оборудование"
    ],
    "isPinned": false,
    "link": "/departments/dep-eng",
    "history": [
      {
        "id": "dh-011-3",
        "fromStatus": "inReview",
        "toStatus": "rejected",
        "changedAt": "2026-02-14T05:00:00.000Z",
        "changedById": "emp-006",
        "comment": "Отклонено: требуется уточнение по бюджету квартала."
      },
      {
        "id": "dh-011-2",
        "fromStatus": "draft",
        "toStatus": "inReview",
        "changedAt": "2026-02-13T06:00:00.000Z",
        "changedById": "emp-024",
        "comment": "Передано в финконтроль."
      },
      {
        "id": "dh-011-1",
        "fromStatus": "",
        "toStatus": "draft",
        "changedAt": "2026-02-12T08:00:00.000Z",
        "changedById": "emp-024",
        "comment": "Создан черновик заявки на закупку."
      }
    ]
  },
  {
    "id": "doc-012",
    "title": "Счет на обучение по ML для аналитиков",
    "regNumber": "INV-2026-241",
    "type": "invoice",
    "status": "draft",
    "initiatorId": "emp-026",
    "assigneeId": "emp-014",
    "departmentId": "dep-data",
    "dueDate": "2026-02-22",
    "updatedAt": "2026-02-14T10:00:00.000Z",
    "summary": "Оплата внешней программы обучения по MLOps для команды аналитики.",
    "tags": [
      "обучение",
      "ml",
      "развитие"
    ],
    "isPinned": false,
    "link": "/knowledge/kb-008",
    "history": [
      {
        "id": "dh-012-1",
        "fromStatus": "",
        "toStatus": "draft",
        "changedAt": "2026-02-14T10:00:00.000Z",
        "changedById": "emp-026",
        "comment": "Счет заведен и ожидает валидации бюджета."
      }
    ]
  }
];

export const employees = [
  {
    "id": "emp-001",
    "firstName": "Александр",
    "lastName": "Волков",
    "displayName": "Александр Волков",
    "employeeNumber": "Т-0001",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/90b8ec37a8eceebef3273940db57ca58?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F40.jpg&s=160&r=g",
    "title": "Генеральный директор",
    "grade": "L3",
    "departmentId": "dep-exec",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-001@portal.local",
      "phone": "+7-901-1000000",
      "internalPhone": "вн. 2000",
      "messenger": "@emp-001"
    },
    "managerId": null,
    "statusToday": "inOffice",
    "hireDate": "2018-01-01",
    "birthDate": "1980-01-01",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-002",
    "firstName": "Ирина",
    "lastName": "Кузнецова",
    "displayName": "Ирина Кузнецова",
    "employeeNumber": "Т-0002",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/bcb663d06eb62e8f1a77dfee359e6752?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F92.jpg&s=160&r=g",
    "title": "Директор по разработке",
    "grade": "L4",
    "departmentId": "dep-eng",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-002@portal.local",
      "phone": "+7-901-1000001",
      "internalPhone": "вн. 2001",
      "messenger": "@emp-002"
    },
    "managerId": "emp-001",
    "statusToday": "remote",
    "hireDate": "2019-02-02",
    "birthDate": "1981-02-02",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-003",
    "firstName": "Марина",
    "lastName": "Соколова",
    "displayName": "Марина Соколова",
    "employeeNumber": "Т-0003",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/1969bb29164f3799e18e1b51f1d2979b?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F52.jpg&s=160&r=g",
    "title": "Директор по продукту",
    "grade": "L5",
    "departmentId": "dep-prod",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-003@portal.local",
      "phone": "+7-901-1000002",
      "internalPhone": "вн. 2002",
      "messenger": "@emp-003"
    },
    "managerId": "emp-001",
    "statusToday": "inOffice",
    "hireDate": "2020-03-03",
    "birthDate": "1982-03-03",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-004",
    "firstName": "Дмитрий",
    "lastName": "Смирнов",
    "displayName": "Дмитрий Смирнов",
    "employeeNumber": "Т-0004",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/f691d48568682cd807f026bd97ff8221?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F41.jpg&s=160&r=g",
    "title": "Руководитель аналитики",
    "grade": "L6",
    "departmentId": "dep-data",
    "locationId": "loc-spb",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-004@portal.local",
      "phone": "+7-901-1000003",
      "internalPhone": "вн. 2003",
      "messenger": "@emp-004"
    },
    "managerId": "emp-002",
    "statusToday": "vacation",
    "hireDate": "2021-04-04",
    "birthDate": "1983-04-04",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-005",
    "firstName": "Екатерина",
    "lastName": "Лебедева",
    "displayName": "Екатерина Лебедева",
    "employeeNumber": "Т-0005",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/d3d8ca164e5f3a898343227bd4d7f098?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F45.jpg&s=160&r=g",
    "title": "Руководитель дизайна",
    "grade": "L3",
    "departmentId": "dep-design",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-005@portal.local",
      "phone": "+7-901-1000004",
      "internalPhone": "вн. 2004",
      "messenger": "@emp-005"
    },
    "managerId": "emp-003",
    "statusToday": "inOffice",
    "hireDate": "2022-05-05",
    "birthDate": "1984-05-05",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-006",
    "firstName": "Павел",
    "lastName": "Морозов",
    "displayName": "Павел Морозов",
    "employeeNumber": "Т-0006",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/5f395a681a964cc874a60c1cf9dc38bd?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F65.jpg&s=160&r=g",
    "title": "Руководитель операций",
    "grade": "L4",
    "departmentId": "dep-ops",
    "locationId": "loc-ekb",
    "timezone": "Asia/Yekaterinburg",
    "contacts": {
      "email": "emp-006@portal.local",
      "phone": "+7-901-1000005",
      "internalPhone": "вн. 2005",
      "messenger": "@emp-006"
    },
    "managerId": "emp-001",
    "statusToday": "trip",
    "hireDate": "2023-06-06",
    "birthDate": "1985-06-06",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-007",
    "firstName": "Ольга",
    "lastName": "Белова",
    "displayName": "Ольга Белова",
    "employeeNumber": "Т-0007",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/808093d94df4cc33a366b1ff744e1fb5?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F54.jpg&s=160&r=g",
    "title": "Руководитель отдела кадров и развития",
    "grade": "L5",
    "departmentId": "dep-hr",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-007@portal.local",
      "phone": "+7-901-1000006",
      "internalPhone": "вн. 2006",
      "messenger": "@emp-007"
    },
    "managerId": "emp-001",
    "statusToday": "remote",
    "hireDate": "2024-07-07",
    "birthDate": "1986-07-07",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-008",
    "firstName": "Игорь",
    "lastName": "Федоров",
    "displayName": "Игорь Федоров",
    "employeeNumber": "Т-0008",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/5fab163d702a77a1467e24f4f0003f92?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F7.jpg&s=160&r=g",
    "title": "Руководитель мобильного направления",
    "grade": "L6",
    "departmentId": "dep-eng",
    "locationId": "loc-spb",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-008@portal.local",
      "phone": "+7-901-1000007",
      "internalPhone": "вн. 2007",
      "messenger": "@emp-008"
    },
    "managerId": "emp-002",
    "statusToday": "inOffice",
    "hireDate": "2018-08-08",
    "birthDate": "1987-08-08",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-009",
    "firstName": "Анна",
    "lastName": "Иванова",
    "displayName": "Анна Иванова",
    "employeeNumber": "Т-0009",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/a0f8221e3de52808dc58d66ba4a03806?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F97.jpg&s=160&r=g",
    "title": "Старший менеджер по продукту",
    "grade": "L3",
    "departmentId": "dep-prod",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-009@portal.local",
      "phone": "+7-901-1000008",
      "internalPhone": "вн. 2008",
      "messenger": "@emp-009"
    },
    "managerId": "emp-003",
    "statusToday": "inOffice",
    "hireDate": "2019-09-09",
    "birthDate": "1988-09-09",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-010",
    "firstName": "Сергей",
    "lastName": "Попов",
    "displayName": "Сергей Попов",
    "employeeNumber": "Т-0010",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/4c30678f3e5b7984a358cdc27d55981f?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F96.jpg&s=160&r=g",
    "title": "Менеджер разработки",
    "grade": "L4",
    "departmentId": "dep-eng",
    "locationId": "loc-spb",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-010@portal.local",
      "phone": "+7-901-1000009",
      "internalPhone": "вн. 2009",
      "messenger": "@emp-010"
    },
    "managerId": "emp-002",
    "statusToday": "remote",
    "hireDate": "2020-10-10",
    "birthDate": "1989-10-10",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-011",
    "firstName": "Никита",
    "lastName": "Семенов",
    "displayName": "Никита Семенов",
    "employeeNumber": "Т-0011",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/d0f0377d450e36df8648f19236cc537f?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F51.jpg&s=160&r=g",
    "title": "Архитектор безопасности",
    "grade": "L5",
    "departmentId": "dep-eng",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-011@portal.local",
      "phone": "+7-901-1000010",
      "internalPhone": "вн. 2010",
      "messenger": "@emp-011"
    },
    "managerId": "emp-002",
    "statusToday": "inOffice",
    "hireDate": "2021-11-11",
    "birthDate": "1990-11-11",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-012",
    "firstName": "Татьяна",
    "lastName": "Крылова",
    "displayName": "Татьяна Крылова",
    "employeeNumber": "Т-0012",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/11b820193cf9e09c7c07fa1e569f7d3e?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F72.jpg&s=160&r=g",
    "title": "Инженер разработки",
    "grade": "L6",
    "departmentId": "dep-eng",
    "locationId": "loc-ekb",
    "timezone": "Asia/Yekaterinburg",
    "contacts": {
      "email": "emp-012@portal.local",
      "phone": "+7-901-1000011",
      "internalPhone": "вн. 2011",
      "messenger": "@emp-012"
    },
    "managerId": "emp-010",
    "statusToday": "vacation",
    "hireDate": "2022-12-12",
    "birthDate": "1991-12-12",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-013",
    "firstName": "Артем",
    "lastName": "Громов",
    "displayName": "Артем Громов",
    "employeeNumber": "Т-0013",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/3f8801ccb169889d1472acc8d03d4474?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F38.jpg&s=160&r=g",
    "title": "Инженер разработки",
    "grade": "L3",
    "departmentId": "dep-eng",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-013@portal.local",
      "phone": "+7-901-1000012",
      "internalPhone": "вн. 2012",
      "messenger": "@emp-013"
    },
    "managerId": "emp-010",
    "statusToday": "inOffice",
    "hireDate": "2023-01-13",
    "birthDate": "1992-01-13",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-014",
    "firstName": "Елена",
    "lastName": "Савина",
    "displayName": "Елена Савина",
    "employeeNumber": "Т-0014",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/5745cf3a5da8870947e07f3739134d06?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F52.jpg&s=160&r=g",
    "title": "Ведущий специалист по данным",
    "grade": "L4",
    "departmentId": "dep-data",
    "locationId": "loc-spb",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-014@portal.local",
      "phone": "+7-901-1000013",
      "internalPhone": "вн. 2013",
      "messenger": "@emp-014"
    },
    "managerId": "emp-004",
    "statusToday": "trip",
    "hireDate": "2024-02-14",
    "birthDate": "1993-02-14",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-015",
    "firstName": "Максим",
    "lastName": "Орлов",
    "displayName": "Максим Орлов",
    "employeeNumber": "Т-0015",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/d51bc3620083af6c0c89549c079b94b2?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F10.jpg&s=160&r=g",
    "title": "Аналитик данных",
    "grade": "L5",
    "departmentId": "dep-data",
    "locationId": "loc-spb",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-015@portal.local",
      "phone": "+7-901-1000014",
      "internalPhone": "вн. 2014",
      "messenger": "@emp-015"
    },
    "managerId": "emp-004",
    "statusToday": "remote",
    "hireDate": "2018-03-15",
    "birthDate": "1994-03-15",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-016",
    "firstName": "София",
    "lastName": "Ковалева",
    "displayName": "София Ковалева",
    "employeeNumber": "Т-0016",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/d287cea0b9263e904f6fefca3fd55ae6?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F4.jpg&s=160&r=g",
    "title": "Дизайнер пользовательского опыта",
    "grade": "L6",
    "departmentId": "dep-design",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-016@portal.local",
      "phone": "+7-901-1000015",
      "internalPhone": "вн. 2015",
      "messenger": "@emp-016"
    },
    "managerId": "emp-005",
    "statusToday": "inOffice",
    "hireDate": "2019-04-16",
    "birthDate": "1980-04-16",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-017",
    "firstName": "Лев",
    "lastName": "Тарасов",
    "displayName": "Лев Тарасов",
    "employeeNumber": "Т-0017",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/611e544fc5ee3a7cc6e7143d311f746c?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F16.jpg&s=160&r=g",
    "title": "Исследователь пользовательского опыта",
    "grade": "L3",
    "departmentId": "dep-design",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-017@portal.local",
      "phone": "+7-901-1000016",
      "internalPhone": "вн. 2016",
      "messenger": "@emp-017"
    },
    "managerId": "emp-005",
    "statusToday": "inOffice",
    "hireDate": "2020-05-17",
    "birthDate": "1981-05-17",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-018",
    "firstName": "Виктория",
    "lastName": "Зайцева",
    "displayName": "Виктория Зайцева",
    "employeeNumber": "Т-0018",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/62bc16054089d41c042fae8c2cf2b3b9?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F61.jpg&s=160&r=g",
    "title": "Руководитель проектов",
    "grade": "L4",
    "departmentId": "dep-ops",
    "locationId": "loc-ekb",
    "timezone": "Asia/Yekaterinburg",
    "contacts": {
      "email": "emp-018@portal.local",
      "phone": "+7-901-1000017",
      "internalPhone": "вн. 2017",
      "messenger": "@emp-018"
    },
    "managerId": "emp-006",
    "statusToday": "remote",
    "hireDate": "2021-06-18",
    "birthDate": "1982-06-18",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-019",
    "firstName": "Юлия",
    "lastName": "Григорьева",
    "displayName": "Юлия Григорьева",
    "employeeNumber": "Т-0019",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/0db961891d1596d944763d00100edeb6?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F35.jpg&s=160&r=g",
    "title": "Лид поддержки",
    "grade": "L5",
    "departmentId": "dep-ops",
    "locationId": "loc-ekb",
    "timezone": "Asia/Yekaterinburg",
    "contacts": {
      "email": "emp-019@portal.local",
      "phone": "+7-901-1000018",
      "internalPhone": "вн. 2018",
      "messenger": "@emp-019"
    },
    "managerId": "emp-006",
    "statusToday": "inOffice",
    "hireDate": "2022-07-19",
    "birthDate": "1983-07-19",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-020",
    "firstName": "Роман",
    "lastName": "Егоров",
    "displayName": "Роман Егоров",
    "employeeNumber": "Т-0020",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/f3b10e09f16818338cc2d90d18653ea2?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F0.jpg&s=160&r=g",
    "title": "Партнер по подбору",
    "grade": "L6",
    "departmentId": "dep-hr",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-020@portal.local",
      "phone": "+7-901-1000019",
      "internalPhone": "вн. 2019",
      "messenger": "@emp-020"
    },
    "managerId": "emp-007",
    "statusToday": "vacation",
    "hireDate": "2023-08-20",
    "birthDate": "1984-08-20",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-021",
    "firstName": "Ксения",
    "lastName": "Алексеева",
    "displayName": "Ксения Алексеева",
    "employeeNumber": "Т-0021",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/0ac4a34de40eb9ad7bc02f9cf4feb9bd?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F16.jpg&s=160&r=g",
    "title": "Рекрутер",
    "grade": "L3",
    "departmentId": "dep-hr",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-021@portal.local",
      "phone": "+7-901-1000020",
      "internalPhone": "вн. 2020",
      "messenger": "@emp-021"
    },
    "managerId": "emp-007",
    "statusToday": "inOffice",
    "hireDate": "2024-09-21",
    "birthDate": "1985-09-21",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-022",
    "firstName": "Георгий",
    "lastName": "Жуков",
    "displayName": "Георгий Жуков",
    "employeeNumber": "Т-0022",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/3702e047aa175a6fe0167bf67a7d0a79?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F32.jpg&s=160&r=g",
    "title": "Инженер тестирования",
    "grade": "L4",
    "departmentId": "dep-eng",
    "locationId": "loc-spb",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-022@portal.local",
      "phone": "+7-901-1000021",
      "internalPhone": "вн. 2021",
      "messenger": "@emp-022"
    },
    "managerId": "emp-010",
    "statusToday": "trip",
    "hireDate": "2018-10-22",
    "birthDate": "1986-10-22",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-023",
    "firstName": "Полина",
    "lastName": "Рыбакова",
    "displayName": "Полина Рыбакова",
    "employeeNumber": "Т-0023",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/35218a4d2272e0825a677fa227b19a90?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F33.jpg&s=160&r=g",
    "title": "Инженер разработки",
    "grade": "L5",
    "departmentId": "dep-eng",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-023@portal.local",
      "phone": "+7-901-1000022",
      "internalPhone": "вн. 2022",
      "messenger": "@emp-023"
    },
    "managerId": "emp-010",
    "statusToday": "remote",
    "hireDate": "2019-11-23",
    "birthDate": "1987-11-23",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-024",
    "firstName": "Владислав",
    "lastName": "Никифоров",
    "displayName": "Владислав Никифоров",
    "employeeNumber": "Т-0024",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/685e24317f457736492d53a2cc2666d2?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F56.jpg&s=160&r=g",
    "title": "Инженер эксплуатации",
    "grade": "L6",
    "departmentId": "dep-eng",
    "locationId": "loc-ekb",
    "timezone": "Asia/Yekaterinburg",
    "contacts": {
      "email": "emp-024@portal.local",
      "phone": "+7-901-1000023",
      "internalPhone": "вн. 2023",
      "messenger": "@emp-024"
    },
    "managerId": "emp-002",
    "statusToday": "inOffice",
    "hireDate": "2020-12-24",
    "birthDate": "1988-12-24",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-025",
    "firstName": "Надежда",
    "lastName": "Михайлова",
    "displayName": "Надежда Михайлова",
    "employeeNumber": "Т-0025",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/c5c117e5a21352e32dc883a5fccf08ae?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F1.jpg&s=160&r=g",
    "title": "Технический писатель",
    "grade": "L3",
    "departmentId": "dep-prod",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-025@portal.local",
      "phone": "+7-901-1000024",
      "internalPhone": "вн. 2024",
      "messenger": "@emp-025"
    },
    "managerId": "emp-003",
    "statusToday": "inOffice",
    "hireDate": "2021-01-25",
    "birthDate": "1989-01-25",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-026",
    "firstName": "Ярослав",
    "lastName": "Данилов",
    "displayName": "Ярослав Данилов",
    "employeeNumber": "Т-0026",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/8eeac36ab42f91eadbe163b6b0d94718?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F89.jpg&s=160&r=g",
    "title": "Бизнес-аналитик",
    "grade": "L4",
    "departmentId": "dep-data",
    "locationId": "loc-spb",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-026@portal.local",
      "phone": "+7-901-1000025",
      "internalPhone": "вн. 2025",
      "messenger": "@emp-026"
    },
    "managerId": "emp-004",
    "statusToday": "remote",
    "hireDate": "2022-02-26",
    "birthDate": "1990-02-26",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-027",
    "firstName": "Алина",
    "lastName": "Тимофеева",
    "displayName": "Алина Тимофеева",
    "employeeNumber": "Т-0027",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/f983201b280794412ffb0a6a70128372?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F43.jpg&s=160&r=g",
    "title": "Координатор программ",
    "grade": "L5",
    "departmentId": "dep-ops",
    "locationId": "loc-ekb",
    "timezone": "Asia/Yekaterinburg",
    "contacts": {
      "email": "emp-027@portal.local",
      "phone": "+7-901-1000026",
      "internalPhone": "вн. 2026",
      "messenger": "@emp-027"
    },
    "managerId": "emp-018",
    "statusToday": "inOffice",
    "hireDate": "2023-03-27",
    "birthDate": "1991-03-27",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-028",
    "firstName": "Кирилл",
    "lastName": "Авдеев",
    "displayName": "Кирилл Авдеев",
    "employeeNumber": "Т-0028",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/c8b4cd5b9052e883c7fed51f8005d804?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F60.jpg&s=160&r=g",
    "title": "Инженер веб-интерфейсов",
    "grade": "L6",
    "departmentId": "dep-eng",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-028@portal.local",
      "phone": "+7-901-1000027",
      "internalPhone": "вн. 2027",
      "messenger": "@emp-028"
    },
    "managerId": "emp-010",
    "statusToday": "vacation",
    "hireDate": "2024-04-01",
    "birthDate": "1992-04-01",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-029",
    "firstName": "Дарья",
    "lastName": "Субботина",
    "displayName": "Дарья Субботина",
    "employeeNumber": "Т-0029",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/58bdedeb838c31551d10dee67ff2928b?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F56.jpg&s=160&r=g",
    "title": "Бэкенд-инженер",
    "grade": "L3",
    "departmentId": "dep-eng",
    "locationId": "loc-spb",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-029@portal.local",
      "phone": "+7-901-1000028",
      "internalPhone": "вн. 2028",
      "messenger": "@emp-029"
    },
    "managerId": "emp-010",
    "statusToday": "inOffice",
    "hireDate": "2018-05-02",
    "birthDate": "1993-05-02",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-030",
    "firstName": "Степан",
    "lastName": "Лаптев",
    "displayName": "Степан Лаптев",
    "employeeNumber": "Т-0030",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/7ec295240c4790db5a56cd999eecac95?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F36.jpg&s=160&r=g",
    "title": "Инженер данных",
    "grade": "L4",
    "departmentId": "dep-data",
    "locationId": "loc-spb",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-030@portal.local",
      "phone": "+7-901-1000029",
      "internalPhone": "вн. 2029",
      "messenger": "@emp-030"
    },
    "managerId": "emp-004",
    "statusToday": "trip",
    "hireDate": "2019-06-03",
    "birthDate": "1994-06-03",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-031",
    "firstName": "Вероника",
    "lastName": "Павлова",
    "displayName": "Вероника Павлова",
    "employeeNumber": "Т-0031",
    "gender": "female",
    "photoUrl": "https://www.gravatar.com/avatar/08bb8df0dd21476d5c3ff6b47e568337?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F19.jpg&s=160&r=g",
    "title": "Продуктовый дизайнер",
    "grade": "L5",
    "departmentId": "dep-design",
    "locationId": "loc-msk",
    "timezone": "Europe/Moscow",
    "contacts": {
      "email": "emp-031@portal.local",
      "phone": "+7-901-1000030",
      "internalPhone": "вн. 2030",
      "messenger": "@emp-031"
    },
    "managerId": "emp-005",
    "statusToday": "remote",
    "hireDate": "2020-07-04",
    "birthDate": "1980-07-04",
    "tags": [
      "core"
    ],
    "visibilityFlags": {}
  },
  {
    "id": "emp-032",
    "firstName": "Михаил",
    "lastName": "Дегтярев",
    "displayName": "Михаил Дегтярев",
    "employeeNumber": "Т-0032",
    "gender": "male",
    "photoUrl": "https://www.gravatar.com/avatar/aa48ad52c8cfc8c313430194c05c61e8?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F71.jpg&s=160&r=g",
    "title": "Операционный аналитик",
    "grade": "L6",
    "departmentId": "dep-ops",
    "locationId": "loc-ekb",
    "timezone": "Asia/Yekaterinburg",
    "contacts": {
      "email": "emp-032@portal.local",
      "phone": "+7-901-1000031",
      "internalPhone": "вн. 2031",
      "messenger": "@emp-032"
    },
    "managerId": "emp-006",
    "statusToday": "inOffice",
    "hireDate": "2021-08-05",
    "birthDate": "1981-08-05",
    "tags": [
      "delivery"
    ],
    "visibilityFlags": {}
  }
];

export const knowledgeBase = [
  {
    "id": "kb-001",
    "title": "Политика удаленной работы",
    "summary": "Правила согласования удаленной работы, присутствия в офисе и форматы отчетности.",
    "contentHtml": "\n      <div class=\"rich-article\">\n        <p class=\"lead\"><strong>Политика удалённой работы</strong> определяет единые правила для гибридного и удалённого формата занятости в компании.</p>\n        <h3>Базовые принципы</h3>\n        <ul>\n          <li>Результат и соблюдение SLA важнее физического присутствия в офисе.</li>\n          <li>Для гибридных команд минимум 2 офисных дня в неделю по графику отдела.</li>\n          <li>Все договорённости фиксируются в календаре и в задачах команды.</li>\n        </ul>\n        <div class=\"highlight-box\">\n          <strong>Окна доступности</strong>\n          <p>Обязательное время присутствия в рабочих каналах: 10:00-17:00 по локальному времени сотрудника, если иное не согласовано с руководителем.</p>\n        </div>\n      </div>\n    ",
    "url": "https://intra.portal.local/docs/remote-policy",
    "category": "Политики",
    "tags": [
      "удаленка",
      "гибрид",
      "политика"
    ],
    "pinned": true,
    "access": {
      "type": "all",
      "ids": []
    },
    "departmentIds": [
      "dep-exec",
      "dep-eng",
      "dep-prod",
      "dep-design",
      "dep-data",
      "dep-ops",
      "dep-hr"
    ],
    "isRegulation": true,
    "updatedAt": "2026-01-28T06:00:00.000Z",
    "authorId": "emp-007"
  },
  {
    "id": "kb-002",
    "title": "Регламент релизов и изменений",
    "summary": "Порядок релизов, окно выката, ответственность и чек-лист до и после релиза.",
    "contentHtml": "\n      <div class=\"rich-article\">\n        <p class=\"lead\"><strong>Регламент релизов и изменений</strong> устанавливает безопасный цикл выпуска изменений для всех продуктовых контуров.</p>\n        <h3>Этапы релиза</h3>\n        <ol>\n          <li>Подготовка change-заявки и чек-листа рисков.</li>\n          <li>Техническое и операционное согласование.</li>\n          <li>Выкат в окно релиза и пост-контроль метрик.</li>\n        </ol>\n        <table>\n          <thead>\n            <tr><th>Класс изменения</th><th>Согласование</th><th>Окно</th></tr>\n          </thead>\n          <tbody>\n            <tr><td>Стандартное</td><td>Техлид</td><td>Вт/Чт 19:00-21:00</td></tr>\n            <tr><td>Рискованное</td><td>Техлид + Операции</td><td>По отдельному плану</td></tr>\n            <tr><td>Критичное</td><td>CAB</td><td>Аварийное окно</td></tr>\n          </tbody>\n        </table>\n      </div>\n    ",
    "url": "https://intra.portal.local/docs/release-regulation",
    "category": "Регламенты",
    "tags": [
      "релизы",
      "эксплуатация",
      "процессы"
    ],
    "pinned": true,
    "access": {
      "type": "departments",
      "ids": [
        "dep-eng",
        "dep-prod",
        "dep-ops"
      ]
    },
    "departmentIds": [
      "dep-eng",
      "dep-prod",
      "dep-ops"
    ],
    "isRegulation": true,
    "updatedAt": "2026-01-31T08:00:00.000Z",
    "authorId": "emp-002"
  },
  {
    "id": "kb-003",
    "title": "Шаблон ежеквартального отчета отдела",
    "summary": "Готовый шаблон для подготовки квартальной отчетности по целям, рискам и бюджету.",
    "contentHtml": "<p>Шаблон включает блоки: цели/результаты, бюджет, риски, план на следующий квартал.</p>",
    "url": "https://intra.portal.local/templates/quarter-report",
    "category": "Шаблоны",
    "tags": [
      "отчет",
      "шаблон",
      "квартал"
    ],
    "pinned": false,
    "access": {
      "type": "all",
      "ids": []
    },
    "departmentIds": [
      "dep-exec",
      "dep-prod",
      "dep-eng",
      "dep-design",
      "dep-data",
      "dep-ops",
      "dep-hr"
    ],
    "isRegulation": false,
    "updatedAt": "2026-01-24T07:00:00.000Z",
    "authorId": "emp-001"
  },
  {
    "id": "kb-004",
    "title": "Регламент онбординга сотрудников",
    "summary": "Чек-лист адаптации сотрудника на первые 30 дней и контрольные точки.",
    "contentHtml": "\n      <div class=\"rich-article\">\n        <p class=\"lead\"><strong>Регламент онбординга сотрудников</strong> описывает сквозной процесс адаптации на первые 30 дней работы.</p>\n        <h3>Роли и ответственность</h3>\n        <ul>\n          <li>HR-партнёр: документы, оргвопросы, вводная встреча.</li>\n          <li>Руководитель: цели на испытательный срок и рабочий контур.</li>\n          <li>Наставник: практическая адаптация и регулярная обратная связь.</li>\n        </ul>\n        <h3>Контрольные точки</h3>\n        <ul class=\"timeline\">\n          <li><span>День 1</span><span>Вводная встреча, доступы, стартовые задачи</span></li>\n          <li><span>Неделя 2</span><span>Промежуточная оценка адаптации</span></li>\n          <li><span>День 30</span><span>Итоговое ревью и план развития</span></li>\n        </ul>\n      </div>\n    ",
    "url": "https://intra.portal.local/docs/onboarding",
    "category": "Регламенты",
    "tags": [
      "кадры",
      "адаптация"
    ],
    "pinned": true,
    "access": {
      "type": "departments",
      "ids": [
        "dep-hr",
        "dep-exec"
      ]
    },
    "departmentIds": [
      "dep-hr",
      "dep-exec"
    ],
    "isRegulation": true,
    "updatedAt": "2026-02-05T10:00:00.000Z",
    "authorId": "emp-007"
  },
  {
    "id": "kb-005",
    "title": "Регламент управления инцидентами",
    "summary": "Классификация инцидентов, уровни сервиса реагирования и порядок эскалации.",
    "contentHtml": "\n      <div class=\"rich-article\">\n        <p class=\"lead\"><strong>Регламент управления инцидентами</strong> фиксирует классификацию, время реакции и порядок эскалации.</p>\n        <h3>Классы инцидентов</h3>\n        <div class=\"fact-grid\">\n          <div class=\"fact-item\"><span>P1</span><strong>Критичный</strong><p>Реакция до 15 минут, эскалация в руководство.</p></div>\n          <div class=\"fact-item\"><span>P2</span><strong>Высокий</strong><p>Реакция до 30 минут, контроль до восстановления.</p></div>\n          <div class=\"fact-item\"><span>P3</span><strong>Средний</strong><p>Реакция до 2 часов, плановое устранение.</p></div>\n        </div>\n        <blockquote>Каждый критичный инцидент требует постмортем с корректирующими действиями в течение 48 часов.</blockquote>\n      </div>\n    ",
    "url": "https://intra.portal.local/docs/incidents",
    "category": "Регламенты",
    "tags": [
      "инциденты",
      "уровни-сервиса",
      "дежурство"
    ],
    "pinned": true,
    "access": {
      "type": "departments",
      "ids": [
        "dep-eng",
        "dep-ops"
      ]
    },
    "departmentIds": [
      "dep-eng",
      "dep-ops"
    ],
    "isRegulation": true,
    "updatedAt": "2026-02-03T06:00:00.000Z",
    "authorId": "emp-006"
  },
  {
    "id": "kb-006",
    "title": "Инструкция: согласование командировок",
    "summary": "Пошаговое оформление командировок, лимиты и сроки согласования.",
    "contentHtml": "<p>Командировка согласуется минимум за 5 рабочих дней через сервис заявок. Аванс оформляется после согласования бюджета.</p>",
    "url": "https://intra.portal.local/docs/business-trip",
    "category": "Инструкции",
    "tags": [
      "командировки",
      "финансы"
    ],
    "pinned": false,
    "access": {
      "type": "all",
      "ids": []
    },
    "departmentIds": [
      "dep-exec",
      "dep-ops",
      "dep-hr"
    ],
    "isRegulation": false,
    "updatedAt": "2026-02-06T12:00:00.000Z",
    "authorId": "emp-006"
  },
  {
    "id": "kb-007",
    "title": "Регламент дизайн-ревью",
    "summary": "Правила проведения дизайн-ревью, критерии качества и сроки согласования.",
    "contentHtml": "\n      <div class=\"rich-article\">\n        <p class=\"lead\"><strong>Регламент дизайн-ревью</strong> задаёт единый стандарт качества UX/UI перед передачей в разработку.</p>\n        <h3>Критерии приёмки</h3>\n        <ul>\n          <li>Соответствие дизайн-системе и сценариям доступности.</li>\n          <li>Проверка edge-case сценариев и состояний ошибок.</li>\n          <li>Подтверждение продуктовой гипотезы и метрик успеха.</li>\n        </ul>\n        <div class=\"highlight-box\">\n          <strong>Состав ревью</strong>\n          <p>Дизайнер, продакт, ведущий разработчик и представитель аналитики для валидации пользовательского потока.</p>\n        </div>\n      </div>\n    ",
    "url": "https://intra.portal.local/docs/design-review",
    "category": "Регламенты",
    "tags": [
      "дизайн",
      "ревью",
      "пользовательский-опыт"
    ],
    "pinned": true,
    "access": {
      "type": "departments",
      "ids": [
        "dep-design",
        "dep-prod",
        "dep-eng"
      ]
    },
    "departmentIds": [
      "dep-design",
      "dep-prod",
      "dep-eng"
    ],
    "isRegulation": true,
    "updatedAt": "2026-02-01T13:00:00.000Z",
    "authorId": "emp-005"
  },
  {
    "id": "kb-008",
    "title": "Гайд по витринам показателей",
    "summary": "Стандарты построения витрин показателей, именование метрик и контроль качества данных.",
    "contentHtml": "<p>Каждая метрика должна иметь ответственного, описание, формулу и частоту обновления.</p>",
    "url": "https://intra.portal.local/docs/kpi-guide",
    "category": "Гайды",
    "tags": [
      "показатели",
      "аналитика",
      "витрины"
    ],
    "pinned": false,
    "access": {
      "type": "departments",
      "ids": [
        "dep-data",
        "dep-prod"
      ]
    },
    "departmentIds": [
      "dep-data",
      "dep-prod"
    ],
    "isRegulation": false,
    "updatedAt": "2026-01-26T08:00:00.000Z",
    "authorId": "emp-004"
  },
  {
    "id": "kb-009",
    "title": "Политика классификации данных",
    "summary": "Классы данных, уровни доступа и обязательные меры защиты.",
    "contentHtml": "\n      <div class=\"rich-article\">\n        <p class=\"lead\"><strong>Политика классификации данных</strong> определяет уровни доступа, хранения и передачи данных в корпоративном контуре.</p>\n        <h3>Классы данных</h3>\n        <table>\n          <thead>\n            <tr><th>Класс</th><th>Описание</th><th>Требования</th></tr>\n          </thead>\n          <tbody>\n            <tr><td>Публичные</td><td>Не ограничены в распространении</td><td>Базовый контроль версий</td></tr>\n            <tr><td>Внутренние</td><td>Для сотрудников компании</td><td>Доступ по ролям</td></tr>\n            <tr><td>Конфиденциальные</td><td>Критичные бизнес-данные</td><td>Шифрование + журнал доступа</td></tr>\n          </tbody>\n        </table>\n        <blockquote>Для конфиденциальных наборов данных обязательны регулярный аудит и ротация ключей доступа.</blockquote>\n      </div>\n    ",
    "url": "https://intra.portal.local/docs/data-classification",
    "category": "Политики",
    "tags": [
      "данные",
      "безопасность",
      "соответствие-требованиям"
    ],
    "pinned": true,
    "access": {
      "type": "roles",
      "ids": [
        "role-da",
        "role-arch"
      ]
    },
    "departmentIds": [
      "dep-data",
      "dep-eng"
    ],
    "isRegulation": true,
    "updatedAt": "2026-02-04T07:00:00.000Z",
    "authorId": "emp-011"
  },
  {
    "id": "kb-010",
    "title": "Шаблон карточки проекта",
    "summary": "Структура карточки проекта: цели, scope, этапы, риски, команда.",
    "contentHtml": "\n      <div class=\"rich-article\">\n        <p class=\"lead\"><strong>Шаблон карточки проекта</strong> помогает стандартизировать запуск и сопровождение новых инициатив.</p>\n        <h3>Обязательные блоки карточки</h3>\n        <ol>\n          <li>Цель проекта и измеримые KPI.</li>\n          <li>Scope, ограничения и зависимости.</li>\n          <li>План этапов, риски и ответственность ролей.</li>\n        </ol>\n        <div class=\"highlight-box\">\n          <strong>Практика</strong>\n          <p>Карточка должна обновляться не реже одного раза в неделю и служить единой точкой правды для команды и стейкхолдеров.</p>\n        </div>\n      </div>\n    ",
    "url": "https://intra.portal.local/templates/project-card",
    "category": "Шаблоны",
    "tags": [
      "проект",
      "инициация",
      "шаблон"
    ],
    "pinned": true,
    "access": {
      "type": "all",
      "ids": []
    },
    "departmentIds": [
      "dep-prod",
      "dep-eng",
      "dep-ops"
    ],
    "isRegulation": false,
    "updatedAt": "2026-02-07T09:00:00.000Z",
    "authorId": "emp-003"
  },
  {
    "id": "kb-011",
    "title": "Регламент ведения проектной документации",
    "summary": "Правила версионирования, хранения и обновления документов проектов.",
    "contentHtml": "<p>Каждый проект обязан иметь владельца документации и ежемесячный аудит актуальности.</p>",
    "url": "https://intra.portal.local/docs/project-docs",
    "category": "Регламенты",
    "tags": [
      "документация",
      "проекты"
    ],
    "pinned": false,
    "access": {
      "type": "departments",
      "ids": [
        "dep-prod",
        "dep-eng",
        "dep-data"
      ]
    },
    "departmentIds": [
      "dep-prod",
      "dep-eng",
      "dep-data"
    ],
    "isRegulation": true,
    "updatedAt": "2026-02-08T08:00:00.000Z",
    "authorId": "emp-025"
  },
  {
    "id": "kb-012",
    "title": "Частые вопросы: отпуск и отсутствие",
    "summary": "Ответы на частые вопросы по отпуску, больничному и выходным.",
    "contentHtml": "<p>В разделе описаны сроки согласования и требования к подтверждающим документам.</p>",
    "url": "https://intra.portal.local/docs/absence-faq",
    "category": "Частые вопросы",
    "tags": [
      "отпуск",
      "отсутствия",
      "кадры"
    ],
    "pinned": false,
    "access": {
      "type": "all",
      "ids": []
    },
    "departmentIds": [
      "dep-hr",
      "dep-ops"
    ],
    "isRegulation": false,
    "updatedAt": "2026-02-10T06:00:00.000Z",
    "authorId": "emp-007"
  }
];

export const locations = [
  {
    "id": "loc-msk",
    "name": "Москва (штаб-квартира)",
    "country": "Россия",
    "city": "Москва",
    "office": "Ленинградский проспект, 39с79"
  },
  {
    "id": "loc-spb",
    "name": "Санкт-Петербург (офис)",
    "country": "Россия",
    "city": "Санкт-Петербург",
    "office": "Пискаревский проспект, 2к2"
  },
  {
    "id": "loc-ekb",
    "name": "Екатеринбург (офис)",
    "country": "Россия",
    "city": "Екатеринбург",
    "office": "улица Бориса Ельцина, 3"
  }
];

export const news = [
  {
    "id": "news-001",
    "title": "Общее собрание компании: 3 марта",
    "bodyHtml": "\n      <div class=\"rich-article\">\n        <p class=\"lead\"><strong>Коллеги, приглашаем на квартальное общее собрание компании</strong> в понедельник, 3 марта, в 11:00 по Москве. В фокусе встречи: результаты, план на следующий квартал и решения по ключевым инициативам.</p>\n        <div class=\"highlight-box\">\n          <strong>Формат встречи</strong>\n          <ul>\n            <li>Онлайн-трансляция для всех локаций и очное присутствие руководителей в московском офисе.</li>\n            <li>Длительность: 90 минут + блок «вопрос-ответ».</li>\n            <li>Запись, презентация и материалы будут опубликованы в базе знаний в день собрания.</li>\n          </ul>\n        </div>\n        <h3>Ключевые темы квартала</h3>\n        <div class=\"fact-grid\">\n          <div class=\"fact-item\">\n            <span>Финансы</span>\n            <strong>Выручка +18%</strong>\n            <p>Рост за счёт продуктовых апдейтов и расширения клиентского контура.</p>\n          </div>\n          <div class=\"fact-item\">\n            <span>Продукт</span>\n            <strong>4 релиза</strong>\n            <p>Запущены новые сценарии СЭД и улучшения по оргструктуре.</p>\n          </div>\n          <div class=\"fact-item\">\n            <span>Команда</span>\n            <strong>+7 специалистов</strong>\n            <p>Усилены направления аналитики, HR и платформенной разработки.</p>\n          </div>\n        </div>\n        <h3>Что подготовить заранее</h3>\n        <ol>\n          <li>Проверьте, что ваш вопрос внесён в форму обратной связи до конца пятницы.</li>\n          <li>Подготовьте предложения по улучшению процессов в своей функции.</li>\n          <li>Обновите статусы по ключевым инициативам вашего отдела.</li>\n        </ol>\n        <blockquote>Цель собрания: синхронизировать приоритеты компании и команд на ближайшие 90 дней.</blockquote>\n      </div>\n    ",
    "tags": [
      "общее-собрание",
      "компания"
    ],
    "priority": "important",
    "audience": {
      "type": "all",
      "ids": []
    },
    "publishedAt": "2026-02-12T07:00:00.000Z",
    "authorId": "emp-001",
    "pinned": true,
    "readReceiptRequired": false
  },
  {
    "id": "news-002",
    "title": "Критичное: окно обновления безопасности",
    "bodyHtml": "\n      <div class=\"rich-article\">\n        <p class=\"lead\"><strong>Сегодня с 23:00 до 23:45 МСК</strong> состоится обязательное обновление платформы безопасности. В это окно часть внутренних сервисов может быть временно недоступна.</p>\n        <div class=\"highlight-box warning\">\n          <strong>Критичное окно обслуживания</strong>\n          <p>До 22:50 МСК завершите операции в административных системах и сохраните активные сессии.</p>\n        </div>\n        <h3>Что меняется в контуре безопасности</h3>\n        <ul>\n          <li>Новая политика паролей и усиленная двухфакторная аутентификация для привилегированных ролей.</li>\n          <li>Ротация сертификатов и сервисных ключей интеграций.</li>\n          <li>Обновление матрицы токенов для API-шлюзов и внутренних сервисов.</li>\n        </ul>\n        <h3>План проверки после обновления</h3>\n        <table>\n          <thead>\n            <tr>\n              <th>Время</th>\n              <th>Действие</th>\n              <th>Ответственный</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td>23:50</td>\n              <td>Проверка SSO, ролей и прав доступа</td>\n              <td>ИБ + Платформа</td>\n            </tr>\n            <tr>\n              <td>00:05</td>\n              <td>Контроль ошибок авторизации в логах</td>\n              <td>Операции</td>\n            </tr>\n            <tr>\n              <td>00:15</td>\n              <td>Подтверждение стабильности бизнес-контуров</td>\n              <td>Продуктовые команды</td>\n            </tr>\n          </tbody>\n        </table>\n        <blockquote>Если заметите критичную деградацию, сразу отметьте инцидент в дежурном канале и приложите время/скриншот.</blockquote>\n      </div>\n    ",
    "tags": [
      "безопасность",
      "операции"
    ],
    "priority": "critical",
    "audience": {
      "type": "departments",
      "ids": [
        "dep-eng",
        "dep-ops"
      ]
    },
    "publishedAt": "2026-02-14T05:00:00.000Z",
    "authorId": "emp-011",
    "pinned": true,
    "readReceiptRequired": true
  },
  {
    "id": "news-003",
    "title": "Дизайн-система 2.0 запущена",
    "bodyHtml": "\n      <div class=\"rich-article\">\n        <p class=\"lead\"><strong>Дизайн-система 2.0 официально запущена.</strong> Новый набор токенов, компонентов и паттернов уже доступен для всех продуктовых команд.</p>\n        <h3>Что включено в релиз</h3>\n        <ul>\n          <li>Единые токены цвета, отступов и типографики для web-интерфейсов.</li>\n          <li>Библиотека компонентных шаблонов для форм, таблиц и навигации.</li>\n          <li>Гайды по доступности и адаптивной вёрстке для ключевых экранов.</li>\n        </ul>\n        <div class=\"fact-grid\">\n          <div class=\"fact-item\">\n            <span>Компоненты</span>\n            <strong>46</strong>\n            <p>Базовые и составные блоки для MVP и продуктовых модулей.</p>\n          </div>\n          <div class=\"fact-item\">\n            <span>Токены</span>\n            <strong>120+</strong>\n            <p>Цвета, типографика, тени, радиусы и интервалы.</p>\n          </div>\n          <div class=\"fact-item\">\n            <span>Миграция</span>\n            <strong>2 спринта</strong>\n            <p>Пошаговый план перехода с минимальными рисками.</p>\n          </div>\n        </div>\n        <blockquote>До конца месяца просим перевести на новую систему все экраны в активной разработке.</blockquote>\n      </div>\n    ",
    "tags": [
      "дизайн",
      "фронтенд"
    ],
    "priority": "normal",
    "audience": {
      "type": "departments",
      "ids": [
        "dep-design",
        "dep-eng"
      ]
    },
    "publishedAt": "2026-02-09T09:00:00.000Z",
    "authorId": "emp-005",
    "pinned": true,
    "readReceiptRequired": false
  },
  {
    "id": "news-004",
    "title": "Новые правила доступа в офис Екатеринбурга",
    "bodyHtml": "<p>С понедельника обновляется порядок входа и парковки.</p>",
    "tags": [
      "офис"
    ],
    "priority": "normal",
    "audience": {
      "type": "locations",
      "ids": [
        "loc-ekb"
      ]
    },
    "publishedAt": "2026-02-13T06:00:00.000Z",
    "authorId": "emp-006",
    "pinned": false,
    "readReceiptRequired": false
  },
  {
    "id": "news-005",
    "title": "Демонстрация проекта «Луч» в пятницу",
    "bodyHtml": "<p>Демо для стейкхолдеров и сбор обратной связи.</p>",
    "tags": [
      "проект",
      "демо"
    ],
    "priority": "important",
    "audience": {
      "type": "project",
      "ids": [
        "prj-luch"
      ]
    },
    "publishedAt": "2026-02-11T12:00:00.000Z",
    "authorId": "emp-014",
    "pinned": false,
    "readReceiptRequired": false
  },
  {
    "id": "news-006",
    "title": "Отчет по доступности платформы «Вектор Аналитика»",
    "bodyHtml": "<p>Опубликован ежемесячный отчет доступности и инцидентов.</p>",
    "tags": [
      "продукт",
      "доступность"
    ],
    "priority": "normal",
    "audience": {
      "type": "product",
      "ids": [
        "prd-vektor"
      ]
    },
    "publishedAt": "2026-02-07T11:00:00.000Z",
    "authorId": "emp-004",
    "pinned": false,
    "readReceiptRequired": false
  },
  {
    "id": "news-007",
    "title": "Отдел персонала: открыта запись на ДМС",
    "bodyHtml": "\n      <div class=\"rich-article\">\n        <p class=\"lead\"><strong>Открыт период выбора программы ДМС.</strong> Окно выбора действует до 28 февраля включительно для всех сотрудников компании.</p>\n        <h3>Что важно проверить в личном кабинете</h3>\n        <ul>\n          <li>Текущий пакет и набор опций по стоматологии, диагностике и телемедицине.</li>\n          <li>Добавление членов семьи и сроки вступления расширенного покрытия.</li>\n          <li>Актуальность контактных данных для получения полиса и уведомлений.</li>\n        </ul>\n        <div class=\"highlight-box\">\n          <strong>Подсказка HR</strong>\n          <p>Если вы планируете смену программы, сначала сравните перечень клиник в вашем городе и лимиты по ключевым услугам.</p>\n        </div>\n        <h3>Календарь процесса</h3>\n        <ul class=\"timeline\">\n          <li><span>до 20 февраля</span><span>Консультации с HR и страховым партнёром</span></li>\n          <li><span>21-26 февраля</span><span>Фиксация выбранной программы в личном кабинете</span></li>\n          <li><span>с 1 марта</span><span>Применение обновлённого пакета ДМС</span></li>\n        </ul>\n      </div>\n    ",
    "tags": [
      "персонал",
      "льготы"
    ],
    "priority": "important",
    "audience": {
      "type": "all",
      "ids": []
    },
    "publishedAt": "2026-02-10T08:00:00.000Z",
    "authorId": "emp-007",
    "pinned": true,
    "readReceiptRequired": false
  },
  {
    "id": "news-008",
    "title": "Уточнение политики удаленной работы",
    "bodyHtml": "<p>Обновлена матрица согласований для удаленной занятости.</p>",
    "tags": [
      "политика",
      "удаленка"
    ],
    "priority": "normal",
    "audience": {
      "type": "roles",
      "ids": [
        "role-pm",
        "role-po"
      ]
    },
    "publishedAt": "2026-02-08T07:00:00.000Z",
    "authorId": "emp-006",
    "pinned": false,
    "readReceiptRequired": false
  },
  {
    "id": "news-009",
    "title": "Плановые работы в «Атласе»",
    "bodyHtml": "\n      <div class=\"rich-article\">\n        <p class=\"lead\"><strong>В воскресенье с 02:00 до 02:20 МСК</strong> пройдут плановые работы в «Атлас Рабочее пространство». Мы обновляем контур профилей и уведомлений для повышения стабильности.</p>\n        <h3>Ожидаемое влияние</h3>\n        <ul>\n          <li>Кратковременная недоступность разделов «Лента», «Профили» и «Уведомления».</li>\n          <li>Возможны повторные запросы авторизации после завершения окна.</li>\n          <li>Фоновые процессы синхронизации возобновятся автоматически.</li>\n        </ul>\n        <div class=\"highlight-box\">\n          <strong>Контрольные точки после релиза</strong>\n          <ol>\n            <li>Проверка карточек сотрудника и проектных назначений.</li>\n            <li>Проверка доставки уведомлений и статусов прочтения.</li>\n            <li>Проверка глобального поиска по новостям и документам.</li>\n          </ol>\n        </div>\n        <blockquote>Резерв окна обслуживания до 02:30 МСК, но планируем закрыть работы раньше.</blockquote>\n      </div>\n    ",
    "tags": [
      "обслуживание"
    ],
    "priority": "important",
    "audience": {
      "type": "product",
      "ids": [
        "prd-atlas"
      ]
    },
    "publishedAt": "2026-02-15T04:00:00.000Z",
    "authorId": "emp-002",
    "pinned": true,
    "readReceiptRequired": false
  },
  {
    "id": "news-010",
    "title": "Статус миграции поддержки в проекте «Ритм»",
    "bodyHtml": "\n      <div class=\"rich-article\">\n        <p class=\"lead\"><strong>Проект «Ритм» перешёл в фазу стабилизации.</strong> Этап миграции поддержки завершён, команда подтверждает целевые уровни сервиса.</p>\n        <h3>Статус этапов</h3>\n        <table>\n          <thead>\n            <tr>\n              <th>Этап</th>\n              <th>Статус</th>\n              <th>Комментарий</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td>Передача процессов L1/L2</td>\n              <td><span class=\"status-chip done\">Завершено</span></td>\n              <td>Новые регламенты приняты и внедрены.</td>\n            </tr>\n            <tr>\n              <td>Мониторинг SLA</td>\n              <td><span class=\"status-chip doing\">В работе</span></td>\n              <td>Идёт замер стабильности на контрольной выборке.</td>\n            </tr>\n            <tr>\n              <td>Финальный отчёт</td>\n              <td><span class=\"status-chip todo\">План</span></td>\n              <td>Подготовка итоговой сводки до конца недели.</td>\n            </tr>\n          </tbody>\n        </table>\n        <h3>Фокус до закрытия проекта</h3>\n        <ul>\n          <li>Снизить долю повторных обращений минимум на 12%.</li>\n          <li>Закрепить матрицу эскалации между операциями и продуктом.</li>\n          <li>Опубликовать финальный набор документов в СЭД и БЗ.</li>\n        </ul>\n      </div>\n    ",
    "tags": [
      "операции",
      "проект"
    ],
    "priority": "normal",
    "audience": {
      "type": "project",
      "ids": [
        "prj-ritm"
      ]
    },
    "publishedAt": "2026-02-14T13:00:00.000Z",
    "authorId": "emp-018",
    "pinned": true,
    "readReceiptRequired": false
  }
];

export const organization = [
  {
    "id": "org-001",
    "legalName": "Общество с ограниченной ответственностью \"Портал Технологий\"",
    "shortName": "ООО \"Портал Технологий\"",
    "legalForm": "ООО",
    "inn": "7705123456",
    "kpp": "770501001",
    "ogrn": "1027700123456",
    "okpo": "54839210",
    "okved": "62.01",
    "taxOffice": "ИФНС № 5 по г. Москве",
    "registrationDate": "2018-04-11",
    "charterCapital": "10 000 ₽",
    "vatMode": "Общая система налогообложения (ОСНО)",
    "legalAddress": "125040, г. Москва, Ленинградский проспект, д. 39, стр. 79",
    "postalAddress": "125040, г. Москва, а/я 128",
    "directorName": "Александр Волков",
    "directorPosition": "Генеральный директор",
    "signatoryBasis": "Действует на основании Устава",
    "contacts": {
      "phone": "+7 (495) 123-45-67",
      "email": "office@portal.local",
      "website": "portal.local"
    },
    "bankAccounts": [
      {
        "id": "org-bank-1",
        "bankName": "АО \"Альфа-Банк\", г. Москва",
        "bik": "044525593",
        "correspondentAccount": "30101810200000000593",
        "checkingAccount": "40702810900000012034",
        "currency": "RUB",
        "isPrimary": true
      },
      {
        "id": "org-bank-2",
        "bankName": "ПАО Сбербанк, г. Москва",
        "bik": "044525225",
        "correspondentAccount": "30101810400000000225",
        "checkingAccount": "40702810238000054210",
        "currency": "RUB",
        "isPrimary": false
      }
    ]
  }
];

export const products = [
  {
    "id": "prd-atlas",
    "name": "Атлас Рабочее пространство",
    "code": "ATLAS",
    "description": "Единое внутреннее рабочее пространство компании",
    "ownerId": "emp-003",
    "status": "active",
    "startDate": "2025-03-12",
    "endDate": null,
    "tags": [
      "внутренний",
      "рабочее-пространство"
    ],
    "visibility": "company",
    "legalLink": {
      "costCenter": "CC-301",
      "legalEntity": "ООО \"Портал\""
    }
  },
  {
    "id": "prd-vektor",
    "name": "Вектор Аналитика",
    "code": "VEKTOR",
    "description": "Платформа аналитики и управленческой отчетности",
    "ownerId": "emp-004",
    "status": "active",
    "startDate": "2025-05-01",
    "endDate": null,
    "tags": [
      "данные",
      "аналитика"
    ],
    "visibility": "participants",
    "legalLink": {
      "costCenter": "CC-302",
      "legalEntity": "ООО \"Портал\""
    }
  },
  {
    "id": "prd-sfera",
    "name": "Сфера Мобильная платформа",
    "code": "SFERA",
    "description": "Мобильная экосистема клиентских сервисов",
    "ownerId": "emp-008",
    "status": "onHold",
    "startDate": "2025-06-30",
    "endDate": null,
    "tags": [
      "мобильный"
    ],
    "visibility": "restricted",
    "legalLink": {
      "costCenter": "CC-303",
      "legalEntity": "ООО \"Портал\""
    }
  }
];

export const projectRoles = [
  {
    "id": "role-po",
    "name": "Владелец продукта",
    "category": "product",
    "isLeadRole": true
  },
  {
    "id": "role-pm",
    "name": "Руководитель проекта",
    "category": "delivery",
    "isLeadRole": true
  },
  {
    "id": "role-tl",
    "name": "Техлид",
    "category": "engineering",
    "isLeadRole": true
  },
  {
    "id": "role-se",
    "name": "Инженер разработки",
    "category": "engineering",
    "isLeadRole": false
  },
  {
    "id": "role-qa",
    "name": "Инженер тестирования",
    "category": "engineering",
    "isLeadRole": false
  },
  {
    "id": "role-da",
    "name": "Аналитик данных",
    "category": "other",
    "isLeadRole": false
  },
  {
    "id": "role-ux",
    "name": "Дизайнер пользовательского опыта",
    "category": "product",
    "isLeadRole": false
  },
  {
    "id": "role-arch",
    "name": "Архитектор решений",
    "category": "engineering",
    "isLeadRole": false
  }
];

export const projects = [
  {
    "id": "prj-kedr",
    "productId": "prd-atlas",
    "name": "Кедр: обновление портала",
    "code": "KEDR",
    "description": "Редизайн корпоративного портала и миграция сервисов",
    "ownerId": "emp-002",
    "status": "active",
    "startDate": "2025-10-08",
    "endDate": null,
    "tags": [
      "портал",
      "миграция"
    ],
    "visibility": "company",
    "legalLink": {
      "costCenter": "CC-401",
      "legalEntity": "ООО \"Портал\""
    }
  },
  {
    "id": "prj-luch",
    "productId": "prd-vektor",
    "name": "Луч: витрины показателей",
    "code": "LUCH",
    "description": "Набор витрин с метриками для руководителей",
    "ownerId": "emp-004",
    "status": "active",
    "startDate": "2025-11-12",
    "endDate": null,
    "tags": [
      "показатели",
      "аналитика"
    ],
    "visibility": "participants",
    "legalLink": {
      "costCenter": "CC-402",
      "legalEntity": "ООО \"Портал\""
    }
  },
  {
    "id": "prj-volna",
    "productId": "prd-sfera",
    "name": "Волна: редизайн приложения Android",
    "code": "VOLNA",
    "description": "Обновление пользовательского опыта и навигации мобильного приложения",
    "ownerId": "emp-008",
    "status": "onHold",
    "startDate": "2025-09-03",
    "endDate": null,
    "tags": [
      "android",
      "дизайн"
    ],
    "visibility": "restricted",
    "legalLink": {
      "costCenter": "CC-403",
      "legalEntity": "ООО \"Портал\""
    }
  },
  {
    "id": "prj-zaslon",
    "productId": "prd-atlas",
    "name": "Заслон: синхронизация доступов",
    "code": "ZASLON",
    "description": "Единый вход, роли и централизованный доступ",
    "ownerId": "emp-011",
    "status": "active",
    "startDate": "2025-12-07",
    "endDate": null,
    "tags": [
      "безопасность",
      "доступ"
    ],
    "visibility": "company",
    "legalLink": {
      "costCenter": "CC-404",
      "legalEntity": "ООО \"Портал\""
    }
  },
  {
    "id": "prj-prognoz",
    "productId": "prd-vektor",
    "name": "Прогноз: модели машинного обучения",
    "code": "PROGNOZ",
    "description": "Модели прогнозирования выручки и нагрузки",
    "ownerId": "emp-014",
    "status": "active",
    "startDate": "2025-12-15",
    "endDate": null,
    "tags": [
      "модели",
      "прогноз"
    ],
    "visibility": "participants",
    "legalLink": {
      "costCenter": "CC-405",
      "legalEntity": "ООО \"Портал\""
    }
  },
  {
    "id": "prj-ritm",
    "productId": null,
    "name": "Ритм: трансформация поддержки",
    "code": "RITM",
    "description": "Перевод поддержки на новые уровни сервиса и процессы",
    "ownerId": "emp-006",
    "status": "active",
    "startDate": "2025-12-29",
    "endDate": null,
    "tags": [
      "операции",
      "доступность"
    ],
    "visibility": "company",
    "legalLink": {
      "costCenter": "CC-406",
      "legalEntity": "ООО \"Портал\""
    }
  }
];

export const tasks = [
  {
    "id": "task-001",
    "title": "Подготовить итоговый пакет документов по отпускам",
    "description": "Свести комментарии руководителей и отправить на финальное согласование.",
    "status": "inProgress",
    "priority": "high",
    "assigneeId": "emp-007",
    "reporterId": "emp-001",
    "dueDate": "2026-02-15",
    "plannedTime": "09:30",
    "estimateMinutes": 45,
    "relatedType": "document",
    "relatedId": "doc-001",
    "updatedAt": "2026-02-14T06:00:00.000Z",
    "isPinned": true,
    "tags": [
      "кадры",
      "сед"
    ]
  },
  {
    "id": "task-002",
    "title": "Подписать договор сопровождения платформы бизнес-аналитики",
    "description": "Проверить юр-блок и подписать со стороны операций.",
    "status": "todo",
    "priority": "critical",
    "assigneeId": "emp-006",
    "reporterId": "emp-004",
    "dueDate": "2026-02-15",
    "plannedTime": "10:30",
    "estimateMinutes": 30,
    "relatedType": "document",
    "relatedId": "doc-002",
    "updatedAt": "2026-02-14T07:00:00.000Z",
    "isPinned": true,
    "tags": [
      "договор"
    ]
  },
  {
    "id": "task-003",
    "title": "Проверить счет на лицензии аналитики",
    "description": "Сверить лимиты бюджета и отправить в оплату.",
    "status": "todo",
    "priority": "high",
    "assigneeId": "emp-006",
    "reporterId": "emp-014",
    "dueDate": "2026-02-15",
    "plannedTime": "11:45",
    "estimateMinutes": 25,
    "relatedType": "document",
    "relatedId": "doc-004",
    "updatedAt": "2026-02-14T08:00:00.000Z",
    "isPinned": false,
    "tags": [
      "финансы"
    ]
  },
  {
    "id": "task-004",
    "title": "Согласовать изменения уровней сервиса поддержки",
    "description": "Проверить метрики доступности и целевые значения.",
    "status": "inProgress",
    "priority": "medium",
    "assigneeId": "emp-018",
    "reporterId": "emp-006",
    "dueDate": "2026-02-15",
    "plannedTime": "13:20",
    "estimateMinutes": 40,
    "relatedType": "project",
    "relatedId": "prj-ritm",
    "updatedAt": "2026-02-14T10:00:00.000Z",
    "isPinned": false,
    "tags": [
      "уровни-сервиса"
    ]
  },
  {
    "id": "task-005",
    "title": "Подготовить отчет по инцидентам за неделю",
    "description": "Собрать P1/P2 инциденты и действия по их снижению.",
    "status": "todo",
    "priority": "medium",
    "assigneeId": "emp-019",
    "reporterId": "emp-006",
    "dueDate": "2026-02-15",
    "plannedTime": "15:00",
    "estimateMinutes": 35,
    "relatedType": "other",
    "relatedId": "",
    "updatedAt": "2026-02-14T11:00:00.000Z",
    "isPinned": false,
    "tags": [
      "операции"
    ]
  },
  {
    "id": "task-006",
    "title": "Ревью нового регламента релизов",
    "description": "Проверить блоки откатов и контроля рисков.",
    "status": "blocked",
    "priority": "high",
    "assigneeId": "emp-002",
    "reporterId": "emp-011",
    "dueDate": "2026-02-16",
    "plannedTime": "10:00",
    "estimateMinutes": 50,
    "relatedType": "document",
    "relatedId": "kb-002",
    "updatedAt": "2026-02-13T09:00:00.000Z",
    "isPinned": false,
    "tags": [
      "релизы"
    ]
  },
  {
    "id": "task-007",
    "title": "Проверка готовности демонстрации «Луч»",
    "description": "Финальный прогон перед демонстрацией.",
    "status": "done",
    "priority": "medium",
    "assigneeId": "emp-014",
    "reporterId": "emp-004",
    "dueDate": "2026-02-14",
    "plannedTime": "16:30",
    "estimateMinutes": 30,
    "relatedType": "project",
    "relatedId": "prj-luch",
    "updatedAt": "2026-02-14T14:00:00.000Z",
    "isPinned": false,
    "tags": [
      "демо"
    ]
  },
  {
    "id": "task-008",
    "title": "Сформировать список согласантов по документам II квартала",
    "description": "Обновить матрицу согласования в СЭД.",
    "status": "todo",
    "priority": "low",
    "assigneeId": "emp-020",
    "reporterId": "emp-007",
    "dueDate": "2026-02-17",
    "plannedTime": "11:00",
    "estimateMinutes": 20,
    "relatedType": "other",
    "relatedId": "",
    "updatedAt": "2026-02-14T05:00:00.000Z",
    "isPinned": false,
    "tags": [
      "сед",
      "процесс"
    ]
  }
];

export const portalMemory = {
  absences,
  assignments,
  auditLog,
  corporateEvents,
  departments,
  documents,
  employees,
  knowledgeBase,
  locations,
  news,
  organization,
  products,
  projectRoles,
  projects,
  tasks,
};
