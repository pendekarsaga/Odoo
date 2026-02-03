/*
Response dari fetch product id berdasarkan barcode

{
  "jsonrpc": "2.0",
  "id": 58,
  "result": [
    [
      89754,
      "[0311002SGP] SUNGLASSES POLAROID BINTANG S-002"
    ]
  ]
}

Response dari fetch Qty Available berdasarkan product id

{
  "jsonrpc": "2.0",
  "id": 19,
  "result": {
    "domain": {
      "uom_id": [
        [
          "category_id",
          "=",
          1
        ]
      ]
    },
    "value": {
      "qty_available": 3,
      "qty_available_temp": 3,
      "stock_uom_id": [
        1,
        "Unit"
      ],
      "stock_uom_id_temp": [
        1,
        "Unit"
      ],
      "qty_ordered": 1,
      "uom_id": [
        1,
        "Unit"
      ]
    }
  }
}
*/

const BARCODES = [
  "061T515TVB",
  "061S6LTWI",
  ];

const URL_ID = "https://app.mybintang.co.id/web/dataset/call_kw/product.product/name_search";

const URL_QTY = "https://app.mybintang.co.id/web/dataset/call_kw/counter.bill.line/onchange";

const HEADERS = {
    "accept": "*/*",
    "content-type": "application/json",
  }
  
const BODY_ID = {
    "id": 58,
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "model": "product.product",
      "method": "name_search",
      "args": [],
      "kwargs": {
        "name": "barcode",
        "operator": "ilike",
        "args": [
          [
            "available_in_pos",
            "=",
            true
          ]
        ],
        "limit": 8,
        "context": {
          "lang": "id_ID",
          "tz": "Asia/Singapore",
          "uid": 943
        }
      }
    }
  };

const BODY_QTY = {
    "id": 19,
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "args": [
        [],
        {
          "product_id": 89754,
          "qty_available": 0,
          "qty_available_temp": 0,
          "stock_uom_id": false,
          "stock_uom_id_temp": false,
          "qty_ordered": 0,
          "uom_id": false,
          "counter_id": {
            "__last_update": false,
            "state": "draft",
            "name": false,
            "operating_unit_id": 32,
            "location_id": 143,
            "qrcode": false,
            "input_product_id": false,
            "qrcode_binary": false,
            "quotation_date": "2026-01-29 03:26:30",
            "order_date": false,
            "counter_bill_line_ids": [
              [
                0,
                "virtual_3",
                {
                  "product_id": 89754,
                  "qty_available": 0,
                  "qty_available_temp": 0,
                  "stock_uom_id": false,
                  "stock_uom_id_temp": false,
                  "qty_ordered": 0,
                  "uom_id": false
                }
              ]
            ]
          }
        },
        "product_id",
        {
          "product_id": "1",
          "qty_available": "1",
          "qty_available_temp": "",
          "stock_uom_id": "1",
          "stock_uom_id_temp": "",
          "qty_ordered": "",
          "uom_id": ""
        }
      ],
      "model": "counter.bill.line",
      "method": "onchange",
      "kwargs": {
        "context": {
          "lang": "id_ID",
          "tz": "Asia/Singapore",
          "uid": 943
        }
      }
    }
  };

const METHOD = "POST";
const CREDENTIALS = "include";

async function getDataProduct () {
  console.log (`Mencari Product ID dari ${BARCODES.length} Barcode`)
  let result = [];
  
  for (let barcode of BARCODES) {
    BODY_ID.params.kwargs.name = barcode;
    let response = await fetch (URL_ID, {
      headers : HEADERS,
      body : JSON.stringify(BODY_ID),
      method : METHOD,
      credentials : CREDENTIALS,
    });
    
    let resToObj = await response.json();
    
    if (resToObj.result.length === 0) {
      console.log (`Product ID dari ${barcode} tidak ditemukan ⚠️`);
      continue;
    }
    
    console.log (`Product ID ${barcode} ditemukan ✅️`)
    result.push(resToObj.result[0]);
  }
  
  console.log (`Pencarian Product ID Selesai ✅️
  Berhasil Menemukan ${result.length} Product ID dari ${BARCODES.length} Barcode`);
  console.log (""); // Spasi Baris
  
  return result;
}

(async function showQtyAvailable () {
  const dataProduct = await getDataProduct();
  const result = {};
  console.log (`Mencari Qty Available dari ${dataProduct.length} Product ID`);
  console.log ("Product ID ➡️ [Barcode] Nama ➡️ Qty Available")
  
  for (let item of dataProduct) {
    BODY_QTY.params.args[1].product_id = item[0];
    BODY_QTY.params.args[1].counter_id.counter_bill_line_ids[0][2].product_id = item[0];
    
    let response = await fetch (URL_QTY, {
      headers : HEADERS,
      body : JSON.stringify(BODY_QTY),
      method : METHOD,
      credentials : CREDENTIALS,
    });
    
    let resToObj = await response.json();
    
    if (resToObj.result?.value?.qty_available === undefined) {
      console.log(`${item[0]} ➡️ ${item[1]} ➡️ 0 (Qty Available tidak tersedia)`);
      continue;
    }
    
    console.log(`${item[0]} ➡️ ${item[1]} ➡️ ${resToObj.result.value.qty_available}`);
    result[item[0]] = {
      "product" : item[1],
      "qty_available" : resToObj.result.value.qty_available
    };
  }
  
  console.log (`Pencarian Qty Available Selesai ✅️
  🟢 Berhasil Menemukan ${dataProduct.length} Product ID dari ${BARCODES.length} Barcode
  🟢 Berhasi Menemukan ${Object.keys(result).length} Qty Available dari ${dataProduct.length} Product ID
  🔴 Product ID tidak ditemukan = ${BARCODES.length - dataProduct.length}
  🔴 Qty Available tidak ditemukan = ${dataProduct.length - Object.keys(result).length}`);
})();