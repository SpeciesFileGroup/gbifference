import { TableGbifference } from './ui/TableGbifference'
import '@/assets/stylesheets/style.css'

const DWC = {
  "associatedMedia": null,
  "associatedTaxa": null,
  "basisOfRecord": "PreservedSpecimen",
  "catalogNumber": "DRY-218631",
  "class": "Insecta",
  "collectionCode": "TI",
  "continent": null,
  "coordinateUncertaintyInMeters": "100",
  "country": "Norway",
  "county": "Saltdal",
  "datasetName": "Artsprosjekt_21-19_PROCTONOR II",
  "dateIdentified": null,
  "day": "08",
  "decimalLatitude": null,
  "decimalLongitude": null,
  "eventDate": "2020-07-08",
  "family": "Diapriidae",
  "fieldNumber": null,
  "genus": "Entomacis",
  "geodeticDatum": "WGS84",
  "georeferenceRemarks": "OR",
  "habitat": null,
  "id": "urn:uuid:8f3fe604-8e36-4841-8c94-8e1a89b38273",
  "identificationQualifier": null,
  "identifiedBy": "Frode Ødegaard",
  "individualCount": "1",
  "infraspecificEpithet": null,
  "institutionCode": "NTNU-VM",
  "kingdom": "Animalia",
  "lifeStage": null,
  "locality": "Brenne, Sveen",
  "modified": "2021-12-07",
  "month": "07",
  "occurrenceID": "urn:uuid:8f3fe604-8e36-4841-8c94-8e1a89b38273",
  "occurrenceRemarks": null,
  "order": "Hymenoptera",
  "otherCatalogNumbers": null,
  "phylum": "Arthropoda",
  "preparations": "Pinned",
  "recordNumber": null,
  "recordedBy": "Frode Ødegaard",
  "samplingProtocol": null,
  "scientificName": "Entomacis bipunctata",
  "scientificNameAuthorship": "(Kieffer, 1911)",
  "sex": "1u",
  "specificEpithet": null,
  "stateProvince": "Nordland",
  "typeStatus": null,
  "verbatimCoordinates": "67.02865N 15.35405E",
  "verbatimDepth": null,
  "verbatimElevation": null,
  "verbatimSRS": "WGS84",
  "year": "2020"
}

const table = new TableGbifference('#app', {
  occurrenceId: 'urn:uuid:8f3fe604-8e36-4841-8c94-8e1a89b38273',
  source: {
    dwcObject: DWC
  }
}) 
  
table.on('click:cell', e => console.log(e))
