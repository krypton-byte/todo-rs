# 📝 Todo List Application

<div align="center">

![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

**Aplikasi Todo List Modern dengan Backend Rust & Frontend Next.js**

*Dikembangkan untuk memenuhi tugas UAS Perkuliahan*

---

</div>

## 🎯 **Tentang Proyek**

Aplikasi Todo List ini merupakan implementasi full-stack yang menggabungkan kekuatan **Rust** sebagai backend dan **Next.js** sebagai frontend. Proyek ini mendemonstrasikan penggunaan teknologi modern untuk membangun aplikasi web yang performan, aman, dan responsif.

### ✨ **Fitur Utama**

- ✅ **CRUD Operations** - Create, Read, Update, Delete todo items
- 🗑️ **Bulk Delete** - Hapus semua todo yang sudah selesai sekaligus
- 📱 **Responsive Design** - Tampilan optimal di semua perangkat
- ⚡ **Real-time Updates** - Interface yang responsif dan interaktif
- 🔄 **Status Tracking** - Tandai todo sebagai selesai atau belum
- 🎨 **Modern UI** - Antarmuka yang bersih dan intuitif

## 🏗️ **Arsitektur Sistem**

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐    SQL    ┌─────────────────┐
│                 │ ◄──────────────► │                 │ ◄────────► │                 │
│  Next.js        │                 │  Rust Backend   │           │  SQLite         │
│  Frontend       │                 │  (Axum)         │           │  Database       │
│                 │                 │                 │           │                 │
└─────────────────┘                 └─────────────────┘           └─────────────────┘
```

### **Backend (Rust)**
- **Framework**: Axum - Web framework yang performan dan type-safe
- **Database**: Diesel ORM dengan SQLite
- **Migration**: Diesel Migrations untuk manajemen skema database
- **Logging**: Tracing untuk monitoring dan debugging
- **Static Serving**: Rust Embed untuk serving file frontend

### **Frontend (Next.js)**
- **Framework**: Next.js dengan TypeScript
- **Styling**: Tailwind CSS untuk desain modern
- **Component**: React komponen yang reusable
- **State Management**: React hooks untuk manajemen state lokal

## 🛠️ **Teknologi yang Digunakan**

### Backend Dependencies
```toml
axum = "0.8.4"                    # Web framework
diesel = "2.2.11"                 # ORM untuk database
diesel_migrations = "2.2.0"       # Sistem migrasi database
tokio = "1.46.0"                  # Async runtime
serde = "1.0.219"                 # Serialization/deserialization
tower-http = "0.6.6"              # HTTP middleware
tracing = "0.1.41"                # Structured logging
```

### API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/todos` | Mengambil semua todo items |
| `GET` | `/api/todo/{id}` | Mengambil todo berdasarkan ID |
| `POST` | `/api/todo` | Membuat todo baru |
| `PUT` | `/api/todo` | Mengupdate todo yang ada |
| `DELETE` | `/api/todo/{id}` | Menghapus todo berdasarkan ID |
| `DELETE` | `/api/clear` | Menghapus semua todo yang sudah selesai |

## 🚀 **Instalasi dan Menjalankan**

### **Prasyarat**
- Rust (versi terbaru)
- Node.js (v18 atau lebih baru)
- SQLite

### **Langkah Instalasi**

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd todo-rs
   ```

2. **Setup Backend (Rust)**
   ```bash
   # Install dependencies
   cargo build
   
   # Setup database
   cargo install diesel_cli --no-default-features --features sqlite
   diesel setup
   diesel migration run
   ```

3. **Setup Frontend (Next.js)**
   ```bash
   cd ui
   npm install
   # atau
   yarn install
   ```

4. **Build Frontend**
   ```bash
   npm run build
   # atau
   yarn build
   ```

5. **Jalankan Aplikasi**
   ```bash
   # Dari root directory
   cargo run
   ```

   Aplikasi akan berjalan di: `http://localhost:8000`

## 📁 **Struktur Proyek**

```
todo-rs/
├── src/
│   ├── main.rs              # Entry point aplikasi
│   ├── connection.rs        # Database connection & operations
│   ├── lib.rs              # Library exports
│   ├── db/
│   │   ├── models.rs       # Database models
│   │   └── schema.rs       # Database schema
│   └── models/
│       ├── request.rs      # Request models
│       └── response.rs     # Response models
├── migrations/             # Database migrations
├── ui/                    # Next.js frontend
├── Cargo.toml            # Rust dependencies
└── diesel.toml           # Diesel configuration
```

## 🗄️ **Database Schema**

```sql
CREATE TABLE todo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE
);
```

## 🔧 **Konfigurasi**

### **Environment Variables**
```bash
DATABASE_URL=sqlite://todo.db  # URL database SQLite
```

### **Logging**
Aplikasi menggunakan tracing untuk logging dengan level:
- `DEBUG` - Informasi detail untuk development
- `INFO` - Informasi umum aplikasi
- `ERROR` - Error dan masalah sistem

## 🎓 **Konteks Akademik**

Proyek ini dikembangkan sebagai bagian dari **tugas Ujian Akhir Semester (UAS)** yang mendemonstrasikan:

- **Full-Stack Development** - Integrasi backend dan frontend
- **Modern Web Technologies** - Penggunaan teknologi terkini
- **Database Management** - Operasi CRUD dan migrasi database
- **API Design** - RESTful API yang clean dan konsisten
- **Code Organization** - Struktur kode yang terorganisir dan maintainable

## 🚀 **Features Demo**

1. **Tambah Todo**: Buat item todo baru dengan mudah
2. **Edit Todo**: Update judul dan status todo
3. **Hapus Todo**: Remove individual todo atau bulk delete
4. **Filter Status**: Lihat todo berdasarkan status completed/pending
5. **Responsive Design**: Bekerja optimal di desktop dan mobile

## 📊 **Performance & Keamanan**

### **Keunggulan Rust Backend**
- **Memory Safety** - Tanpa garbage collector namun aman dari memory leaks
- **Zero-cost Abstractions** - Performance tinggi tanpa overhead
- **Concurrency** - Handling request concurrent yang efisien
- **Type Safety** - Compile-time error checking yang ketat

### **Optimisasi Frontend**
- **Static Generation** - Pre-built pages untuk loading yang cepat
- **Tree Shaking** - Bundle size yang optimal
- **Lazy Loading** - Component loading sesuai kebutuhan

## 🧪 **Testing & Development**

### **Development Mode**
```bash
# Backend development with auto-reload
cargo watch -x run

# Frontend development
cd ui
npm run dev
```

### **Production Build**
```bash
# Build optimized frontend
cd ui
npm run build

# Build optimized backend
cargo build --release
```

## 🤝 **Kontribusi**

Proyek ini dikembangkan untuk tujuan akademik. Feedback dan saran untuk improvement sangat diterima.

### **Improvement Ideas**
- [ ] Authentication & Authorization
- [ ] Todo categories/tags
- [ ] Due dates & reminders
- [ ] User collaboration
- [ ] Data export/import

## 📝 **Lisensi**

Proyek ini dikembangkan untuk keperluan akademik dan pembelajaran.

---

<div align="center">

**Dibuat dengan ❤️ menggunakan Rust & Next.js**

*Proyek UAS - Menggabungkan Performance Rust dengan Fleksibilitas JavaScript*

</div>
