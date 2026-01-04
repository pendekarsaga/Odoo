/* Format Laporan
Selamat Sore pak/bu

Barang bermasalah tanggal 27/12/2025

- Nomor Faktur: GALD/INT/86130
1. [CDADEJNBIPI172] CASE JELLY POLOS MAGSAFE CAMERA CONTROL BINTANG IPHONE 17 PRO
QTY Faktur: 10 pcs 
QTY Fisik: 0 pcs
QTY Kurang : 10 Pcs

Terimakasih

---

Selamat siang Pak/Bu

Berikut barang masuk tanggal 02/01/2026

*GUDANG*
- Nomor Faktur: GALD/INT/87225 ✅
- Nomor Faktur: GALD/INT/86913 (Waiting Aproval Ada Barber)

Terimakasih
*/

let waktu = new Date();
let namaWaktu;
if (waktu.getHours() <= 3) {
  namaWaktu = "dini hari";
} else if (waktu.getHours() <= 5) {
  namaWaktu = "subuh";
} else if (waktu.getHours() <= 10) {
  namaWaktu = "pagi";
} else if (waktu.getHours() <= 14) {
  namaWaktu = "siang";
} else if (waktu.getHours() <= 17) {
  namaWaktu = "sore";
} else if (waktu.getHours() <= 23) {
  namaWaktu = "malam";
}

let reportBarber = `
Selamat ${namaWaktu} pak/bu


Barang bermasalah tanggal ${waktu.getDate()}/${waktu.getMonth() + 1}/${waktu.getFullYear()}
`;

let reportFaktur = `
Selamat ${namaWaktu} pak/bu


Berikut barang masuk tanggal ${waktu.getDate()}/${waktu.getMonth() + 1}/${waktu.getFullYear()}

*GUDANG*
`;

function optionBarber () {
  return prompt ("1. Faktur Barber Baru\n2. Lanjut Faktur Barber saat ini\n3. Faktur Klop\n4. Selesai","");
}

function optionKlop () {
  return prompt ("1. Lanjut Faktur Klop\n2. Selesai","");
}

outer: for (let i = 1 ; true ; ++i) {
  let noFaktur = prompt ("Nomor Faktur","GALD/INT/");
  reportBarber += `\n- Nomor Faktur: ${noFaktur}`;
  reportFaktur += `- Nomor Faktur: ${noFaktur} (Waiting Aproval, ada Barber)\n`;
  
  for (let i2 = 1 ; true ; ++i2) {
    let produk = prompt ("Nama Produk","");
    let qtyFaktur = prompt ("Qty Faktur","");
    let qtyFisik = prompt ("Qty Fisik","");
    let selisih;
    if (+qtyFaktur > +qtyFisik) {
      selisih = `Qty Kurang: ${+qtyFaktur - +qtyFisik} pcs`
    } else {
      selisih = `Qty Lebih: ${+qtyFisik - +qtyFaktur} pcs`
    }
    
    reportBarber += `
    ${i2}. ${produk}
    Qty Faktur: ${qtyFaktur} pcs
    Qty Fisik: ${qtyFisik} pcs
    ${selisih}
    `;
    
    let option = optionBarber();
    
    if (option === "1") {
      continue outer;
    } else if (option === "2") {
      continue;
    } else if (option === "4") {
      reportBarber += "\nTerimakasih\nIrwansyah/Tl\n";
      break outer;
    } else if (option === "3") {
      for (let i3 = 1 ; true ; ++i3) {
        reportFaktur += `- Nomor Faktur: ${prompt("Faktur Klop","GALD/INT/")}✅\n`;
        let opsi = optionKlop();
        if (opsi === "1") {
          continue;
        } else if (opsi === "2") {
          reportFaktur += "\nTerimakasih\nIrwansyah/Tl\n";
          reportBarber += "\nTerimakasih\nIrwansyah/Tl\n";
          break outer;
        }
      }
    }
  }
}

console.log (reportBarber);
console.log (reportFaktur);