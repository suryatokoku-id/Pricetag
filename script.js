const API_URL =
"https://script.google.com/macros/s/AKfycbwujnL2JudLZLtEzThe6IneuagFPs-wrqrrEFTipM7oQpfrQKUA423xTTMSvxtfOF_U/exec";

const namaInput =
document.getElementById("nama");

namaInput.value =
localStorage.getItem("namaKaryawan") || "";

namaInput.addEventListener("change", () => {
  localStorage.setItem(
    "namaKaryawan",
    namaInput.value
  );
});

async function cariProduk() {

  const keyword =
  document.getElementById("keyword").value;

  if (!keyword) return;

  const res =
  await fetch(
    `${API_URL}?action=search&keyword=${encodeURIComponent(keyword)}`
  );

  const json =
  await res.json();

  tampilkanHasil(json.data);
}

function tampilkanHasil(data){

  const hasil =
  document.getElementById("hasil");

  hasil.innerHTML = "";

  if(!data.length){
    hasil.innerHTML =
    "<div class='card'>Produk tidak ditemukan</div>";
    return;
  }

  if(data.length > 1){

    let html =
    "<div class='card'><h3>Pilih Produk</h3>";

    data.forEach((item,index)=>{

      html += `
      <label>
      <input
      type="radio"
      name="produk"
      value="${index}">
      ${item.nama}
      </label><br>
      `;
    });

    html += `
    <button onclick='pilihProduk(${JSON.stringify(data)})'>
    Pilih
    </button>
    </div>
    `;

    hasil.innerHTML = html;

    return;
  }

  renderProduk(data[0]);
}

function pilihProduk(data){

  const selected =
  document.querySelector(
    "input[name='produk']:checked"
  );

  if(!selected) return;

  renderProduk(
    data[selected.value]
  );
}

function renderProduk(item){

  document.getElementById("hasil").innerHTML = `
  <div class="card">

  <h3>${item.nama}</h3>

  <p>Kode Item : ${item.kode}</p>

  <div class="price">
  Non Member :
  Rp ${formatRupiah(item.non)}
  </div>

  <div class="price">
  Member Ecer :
  Rp ${formatRupiah(item.ecer)}
  </div>

  <div class="price">
  Member Grosir :
  Rp ${formatRupiah(item.grosir)}
  </div>

  <button
  class="request-btn"
  onclick='kirimRequest(
    ${JSON.stringify(item)}
  )'>
  Permintaan Price Tag
  </button>

  </div>
  `;
}

async function kirimRequest(item){

  const namaPeminta =
  document.getElementById("nama").value;

  if(!namaPeminta){
    alert("Isi nama terlebih dahulu");
    return;
  }

  const res =
  await fetch(API_URL,{

    method:"POST",

    body:JSON.stringify({

      action:"request",

      namaPeminta,

      kodeItem:item.kode,

      namaProduk:item.nama

    })

  });

  const json =
  await res.json();

  if(json.status){
    alert(
      "Permintaan Price Tag Berhasil"
    );
  }
}

function formatRupiah(angka){

  return Number(angka || 0)
  .toLocaleString("id-ID");
}

function startScanner(){

  const qr =
  new Html5Qrcode("reader");

  qr.start(
    { facingMode:"environment" },
    {
      fps:10,
      qrbox:250
    },
    (decoded)=>{

      document.getElementById(
        "keyword"
      ).value = decoded;

      qr.stop();

      cariProduk();
    }
  );
}
