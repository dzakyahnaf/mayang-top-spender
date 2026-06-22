# Mayang Top Spender System
### PRD Gap Analysis & Technical Specification v1.2
> Dokumen ini merupakan hasil validasi kritis terhadap PRD v1.0 (19 Juni 2026).  
> Berisi semua koreksi, keputusan arsitektur, dan spesifikasi teknis yang telah dikonfirmasi sebelum implementasi dimulai.  
> **v1.2:** Database engine diubah dari MySQL ke PostgreSQL (Supabase) atas keputusan tim.

---

## Daftar Isi

1. [Ringkasan Keputusan Arsitektur](#1-ringkasan-keputusan-arsitektur)
2. [Tech Stack Final](#2-tech-stack-final)
3. [Gap & Koreksi Kritis PRD v1.0](#3-gap--koreksi-kritis-prd-v10)
   - 3.1 [Database — Bug & Perubahan Wajib](#31-database--bug--perubahan-wajib)
   - 3.2 [Query SQL — Koreksi & Catatan Kompatibilitas](#32-query-sql--koreksi--catatan-kompatibilitas)
   - 3.3 [Use Case — Penambahan & Penyempurnaan](#33-use-case--penambahan--penyempurnaan)
   - 3.4 [Activity Diagram — Alur yang Perlu Dilengkapi](#34-activity-diagram--alur-yang-perlu-dilengkapi)
   - 3.5 [Sequence Diagram — Missing Error Flows](#35-sequence-diagram--missing-error-flows)
   - 3.6 [Security — Hal yang Belum Tercakup PRD v1.0](#36-security--hal-yang-belum-tercakup-prd-v10)
   - 3.7 [Wireframe — Inkonsistensi dengan Sitemap](#37-wireframe--inkonsistensi-dengan-sitemap)
4. [Database Schema Final (Revised)](#4-database-schema-final-revised)
5. [Query SQL Final (Revised)](#5-query-sql-final-revised)
6. [Use Case Tambahan (Addendum)](#6-use-case-tambahan-addendum)
7. [Fitur Baru: OTP WhatsApp (/my-spending)](#7-fitur-baru-otp-whatsapp-my-spending)
8. [Fitur Baru: Edit Transaksi oleh Kasir](#8-fitur-baru-edit-transaksi-oleh-kasir)
9. [Sitemap Final (Revised)](#9-sitemap-final-revised)
10. [Hal yang Belum Ditentukan (Update dari Bab 5 PRD)](#10-hal-yang-belum-ditentukan-update-dari-bab-5-prd)
11. [Priority Fix List](#11-priority-fix-list)
12. [Changelog dari PRD v1.0](#12-changelog-dari-prd-v10)

---

## 1. Ringkasan Keputusan Arsitektur

| Parameter | Keputusan | Catatan |
|-----------|-----------|---------|
| **Deployment URL** | `loyalty.mayangmodestwear.com` | Subdomain terpisah dari main site Squarespace |
| **Relasi dengan main site** | Standalone — tidak ada integrasi | Data customer di sistem ini ≠ akun customer Squarespace |
| **Stack backend** | Laravel (PHP) + PostgreSQL (Supabase) | Pivot dari MySQL — alasan di Bab 2 |
| **ORM approach** | **Hybrid** — Eloquent untuk CRUD, Raw SQL untuk analitik | Lihat detail di Bab 2 |
| **OTP /my-spending** | WhatsApp OTP sebelum data ditampilkan | Gunakan Fonnte / Wablas / Zenziva API |
| **Edit transaksi** | Kasir bisa edit transaksi miliknya sendiri, hari yang sama | Admin bisa edit semua transaksi tanpa batasan hari |

> **Penting:** Website utama `mayangmodestwear.com` berjalan di **Squarespace**. Sistem Top Spender adalah aplikasi Laravel yang sepenuhnya terpisah, di-deploy di subdomain `loyalty.mayangmodestwear.com`. Tidak ada sinkronisasi data antara keduanya.

---

## 2. Tech Stack Final

### Keputusan: Hybrid Eloquent + Raw SQL

PRD v1.0 mengusulkan **full Raw SQL tanpa Eloquent ORM**. Setelah evaluasi, keputusan final adalah pendekatan **hybrid** dengan alasan berikut:

| Aspek | Full Raw SQL (PRD v1.0) | Hybrid (Revised) |
|-------|------------------------|-----------------|
| Keamanan SQL Injection | ⚠️ Manual binding wajib di setiap query | ✅ Eloquent auto-escaped untuk CRUD |
| Development Speed | ❌ Lambat untuk CRUD sederhana | ✅ Cepat dengan Eloquent |
| Maintainability | ❌ Query berserakan di controller | ✅ Logic terorganisir di Model/Repository |
| Query Leaderboard & Dashboard | Raw SQL lebih natural | ✅ Tetap pakai Raw SQL via `DB::select()` |
| Mass Assignment Protection | ❌ Manual | ✅ `$fillable` di Model |

### Keputusan: Pivot dari MySQL ke PostgreSQL (Supabase)

PRD v1.0 menggunakan MySQL. Keputusan diubah ke **PostgreSQL via Supabase** dengan alasan:

| Alasan | Detail |
|--------|--------|
| **Free tier lebih kuat** | Supabase free tier: 500MB storage, koneksi unlimited, permanen — MySQL cloud gratis hampir tidak ada yang viable |
| **Multi-developer access** | Semua developer langsung connect ke Supabase tanpa setup lokal per device |
| **Familiar ecosystem** | Tim sudah terbiasa dengan Supabase/Neon dari project Next.js — zero learning curve |
| **Dashboard lebih baik** | Supabase Table Editor jauh lebih ergonomis dari phpMyAdmin |
| **PostgreSQL lebih powerful** | Native support untuk JSONB, full-text search, window functions, dan constraint yang lebih ketat |
| **`ROW_NUMBER()` tetap didukung** | PostgreSQL sudah support window functions sejak versi 8.4 |

> **Catatan migrasi dari PRD v1.0:** Semua query dan schema di dokumen ini sudah ditulis ulang dalam **PostgreSQL syntax**. MySQL-specific syntax (`AUTO_INCREMENT`, `TINYINT`, `ENUM`, `FORMAT()`, `FULLTEXT INDEX`, `CURDATE()`) sudah diganti dengan PostgreSQL equivalent.

### Aturan Penggunaan ORM

```
ELOQUENT  → CRUD standard: User, Customer, Period, Transaction (create/update/delete)
RAW SQL   → Query analitik: Leaderboard, Dashboard summary, Autocomplete search
```

### Contoh Implementasi

```php
// ✅ CRUD pakai Eloquent
$customer = Customer::create([
    'name'          => $request->name,
    'email'         => $request->email,
    'phone'         => $request->phone,
    'registered_by' => auth()->id(), // nullable untuk self-register
]);

// ✅ Query analitik pakai Raw SQL (PostgreSQL syntax)
$leaderboard = DB::select("
    SELECT
        ROW_NUMBER() OVER (ORDER BY SUM(t.amount) DESC) AS peringkat,
        c.name                                           AS nama_lengkap,
        SUM(t.amount)                                    AS total_belanja
    FROM transactions t
    JOIN customers c ON t.customer_id = c.id
    JOIN periods   p ON t.period_id   = p.id
    WHERE p.is_active = true
      AND p.deleted_at IS NULL
    GROUP BY c.id, c.name
    ORDER BY SUM(t.amount) DESC
");
// Formatting Rupiah (TO_CHAR atau di-handle di Blade/JS)
```

### Stack Lengkap

| Layer | Teknologi |
|-------|-----------|
| Backend Framework | Laravel 11.x |
| Database | PostgreSQL 15+ via **Supabase** (cloud, free tier) |
| ORM | Eloquent (CRUD) + `DB::select()` (analitik) |
| Auth | Custom Auth Guard (2 guard: `admin`, `kasir`) |
| Template Engine | Blade |
| Frontend | Tailwind CSS + Alpine.js (minimal JS) |
| OTP WhatsApp | Fonnte / Wablas / Zenziva (pilih salah satu) |
| Hosting App | VPS/shared hosting support PHP 8.2+ (app Laravel saja, DB di Supabase) |
| Database Hosting | Supabase (cloud PostgreSQL, akses multi-developer) |

### Koneksi Laravel ke Supabase

```env
# .env Laravel — koneksi ke Supabase PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxx.supabase.co   # dari Supabase dashboard > Settings > Database
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-db-password
DB_SSLMODE=require                     # wajib untuk Supabase
```

```php
// config/database.php — tambahkan sslmode
'pgsql' => [
    'driver'   => 'pgsql',
    'host'     => env('DB_HOST'),
    'port'     => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'postgres'),
    'username' => env('DB_USERNAME', 'postgres'),
    'password' => env('DB_PASSWORD', ''),
    'sslmode'  => env('DB_SSLMODE', 'require'),
],
```

---

## 3. Gap & Koreksi Kritis PRD v1.0

### 3.1 Database — Bug & Perubahan Wajib

#### ❌ BUG KRITIS 1 — `ON DELETE CASCADE` Berbahaya di Tabel `transactions`

**Kondisi di PRD v1.0:**
```sql
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
FOREIGN KEY (period_id)   REFERENCES periods(id)   ON DELETE CASCADE,
FOREIGN KEY (cashier_id)  REFERENCES users(id)      ON DELETE CASCADE
```

**Dampak jika dibiarkan:**
- Hapus 1 kasir → semua transaksi yang dia input **ikut terhapus permanen**
- Hapus 1 customer → semua history belanja dan posisi leaderboard-nya **hilang**
- Hapus 1 periode → seluruh data kompetisi **musnah**

**Koreksi (lihat Schema Final di Bab 4):**
```sql
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,  -- ← tidak bisa hapus jika ada transaksi
FOREIGN KEY (period_id)   REFERENCES periods(id)   ON DELETE RESTRICT,  -- ← tidak bisa hapus jika ada transaksi
FOREIGN KEY (cashier_id)  REFERENCES users(id)      ON DELETE SET NULL   -- ← kasir dihapus, transaksi tetap ada
```
> `cashier_id` harus diubah menjadi **nullable** agar `SET NULL` bisa bekerja.

---

#### ❌ BUG KRITIS 2 — Tidak Ada Validasi `amount > 0` di Level Database

**Kondisi di PRD v1.0:**
```sql
-- PRD v1.0 — MySQL syntax (sudah diganti, lihat Schema Final Bab 4)
amount NUMERIC(15,2) NOT NULL
-- Tidak ada constraint CHECK
```

**Dampak:** Kasir bisa input nominal Rp 0 atau nilai negatif secara teknis, merusak akurasi leaderboard.

**Koreksi:**
```sql
-- PostgreSQL syntax
amount NUMERIC(15,2) NOT NULL,
CONSTRAINT chk_amount_positive CHECK (amount > 0)
```
Validasi juga wajib ditambahkan di layer aplikasi (Laravel Form Request).

---

#### ⚠️ PERUBAHAN — Tambah `updated_at` dan Kolom Audit di `transactions`

**Kondisi di PRD v1.0:** Tabel `transactions` tidak memiliki `updated_at`.

**Keputusan:** Tambahkan `updated_at` dan kolom audit untuk mendukung fitur **edit transaksi** (lihat Bab 8):

```sql
-- PostgreSQL syntax
updated_at      TIMESTAMPTZ DEFAULT NOW(),         -- dihandle via trigger set_updated_at()
edited_by       BIGINT NULL,                       -- user_id yang terakhir mengedit
edited_at       TIMESTAMPTZ NULL,                  -- waktu edit terakhir
original_amount NUMERIC(15,2) NULL,                -- nilai amount sebelum diedit (audit trail)
```

---

#### ⚠️ PERUBAHAN — Soft Delete pada Tabel `periods`

**Kondisi di PRD v1.0:** Tidak ada soft delete, periode yang dihapus hilang permanent.

**Keputusan:** Tambahkan soft delete agar data historis bisa diaudit:

```sql
-- PostgreSQL syntax
deleted_at TIMESTAMPTZ NULL DEFAULT NULL
```

Di Laravel, gunakan `SoftDeletes` trait pada model `Period`. Query yang mengambil periode aktif otomatis exclude `deleted_at IS NOT NULL`.

---

#### ⚠️ PERUBAHAN — Tambah Tabel `otp_verifications` (Baru)

Untuk mendukung fitur OTP WhatsApp di `/my-spending`:

```sql
-- PostgreSQL syntax
CREATE TABLE otp_verifications (
    id         BIGSERIAL PRIMARY KEY,
    phone      TEXT NOT NULL,
    otp_code   TEXT NOT NULL,
    purpose    TEXT NOT NULL DEFAULT 'my_spending'
                   CHECK (purpose IN ('my_spending')),
    is_used    BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 3.2 Query SQL — Koreksi & Catatan Kompatibilitas

#### ✅ `ROW_NUMBER()` — Didukung di PostgreSQL

PostgreSQL sudah support window functions (`ROW_NUMBER() OVER()`) sejak versi 8.4. Tidak ada workaround yang diperlukan.

---

#### ❌ BUG — Index Tidak Efektif untuk Query Autocomplete (12.3)

**Kondisi di PRD v1.0:**
```sql
WHERE name  LIKE '%keyword%'
   OR phone LIKE '%keyword%'
   OR email LIKE '%keyword%'
```

**Masalah:** Leading wildcard `'%keyword%'` **menonaktifkan index** biasa. Full table scan terjadi setiap autocomplete request.

**Solusi PostgreSQL — GIN Index dengan `pg_trgm`:**

PostgreSQL punya ekstensi `pg_trgm` (trigram) yang memungkinkan pencarian `LIKE '%keyword%'` **dengan index**. Ini lebih powerful dari MySQL FULLTEXT.

```sql
-- Aktifkan ekstensi (sekali saja, di Supabase SQL Editor)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Buat GIN index pada kolom yang sering dicari
CREATE INDEX idx_customers_name_trgm  ON customers USING GIN (name  gin_trgm_ops);
CREATE INDEX idx_customers_phone_trgm ON customers USING GIN (phone gin_trgm_ops);
CREATE INDEX idx_customers_email_trgm ON customers USING GIN (email gin_trgm_ops);

-- Query autocomplete TETAP bisa pakai LIKE '%keyword%' dan index dipakai ✅
SELECT id, name, email, phone
FROM customers
WHERE name  ILIKE '%' || ? || '%'   -- ILIKE = case-insensitive LIKE di PostgreSQL
   OR phone ILIKE '%' || ? || '%'
   OR email ILIKE '%' || ? || '%'
LIMIT 10;
```

> `ILIKE` adalah PostgreSQL-specific — case-insensitive LIKE. Tidak perlu `LOWER()` wrapper.

---

### 3.3 Use Case — Penambahan & Penyempurnaan

Use case berikut **belum ada di PRD v1.0** dan harus ditambahkan:

| UC ID | Aktor | Nama Use Case | Deskripsi |
|-------|-------|--------------|-----------|
| UC-K06 | Kasir | Edit Transaksi Sendiri | Kasir bisa edit nominal transaksi yang dia input hari yang sama |
| UC-A08 | Admin | Edit Semua Transaksi | Admin bisa edit nominal transaksi siapapun tanpa batasan hari |
| UC-A09 | Admin | Hapus Transaksi | Admin bisa hapus transaksi dengan konfirmasi |
| UC-A10 | Admin | Reset Password Kasir | Admin reset password akun kasir |
| UC-C04 | Customer | Verifikasi OTP WhatsApp | Customer menerima dan input OTP sebelum melihat history belanja |
| UC-P03 | Public | Rate Limiting /my-spending | Sistem membatasi 5 request per IP per menit |

---

### 3.4 Activity Diagram — Alur yang Perlu Dilengkapi

#### 7.3 Input Transaksi — Tambah Decision Node Validasi Amount

Setelah step "Kasir input nominal belanja", tambahkan:

```
KEPUTUSAN: Amount > 0?
  → TIDAK: Tampilkan error "Nominal belanja harus lebih dari Rp 0" → kembali ke input
  → YA:    Lanjut ke cek periode aktif
```

#### 7.5 Manage Periode — Tambah Validasi Tanggal

Setelah admin isi form periode, tambahkan:

```
KEPUTUSAN: start_date < end_date?
  → TIDAK: Tampilkan error "Tanggal selesai harus setelah tanggal mulai" → kembali ke form
  → YA:    Simpan periode
```

#### 7.6 [BARU] Alur /my-spending dengan OTP WhatsApp

| Step | Pelaku | Aktivitas |
|------|--------|-----------|
| 1 | Customer | Akses halaman `/my-spending` |
| 2 | Customer | Input nomor HP |
| 3 | Sistem | Cek: nomor HP terdaftar? |
| 4 | Sistem | [Tidak terdaftar] Tampilkan error "Nomor tidak ditemukan" → SELESAI |
| 5 | Sistem | [Terdaftar] Generate OTP 6 digit, simpan ke `otp_verifications`, kirim via WhatsApp API |
| 6 | Customer | Terima OTP di WhatsApp, input OTP di form |
| 7 | Sistem | Validasi: OTP benar & belum expired (TTL 5 menit) & belum digunakan? |
| 8 | Sistem | [Invalid/Expired] Tampilkan error → customer bisa request ulang |
| 9 | Sistem | [Valid] Mark OTP as used, tampilkan history belanja customer |

---

### 3.5 Sequence Diagram — Missing Error Flows

Semua sequence diagram di PRD v1.0 hanya mencakup **happy path**. Berikut error flows yang wajib diimplementasikan (meski tidak perlu digambar ulang secara diagram, harus ada di kode):

| Flow | Kondisi Error | Response yang Diharapkan |
|------|--------------|-------------------------|
| Input Transaksi | Tidak ada periode aktif | HTTP 422: `{"error": "Tidak ada periode kompetisi yang aktif saat ini"}` |
| Input Transaksi | Amount ≤ 0 | HTTP 422: `{"error": "Nominal belanja harus lebih dari Rp 0"}` |
| Self-Register | Email/HP sudah terdaftar | HTTP 422: `{"error": "Email atau nomor HP sudah terdaftar"}` |
| /my-spending | OTP expired | HTTP 422: `{"error": "Kode OTP sudah kadaluarsa. Minta kode baru."}` |
| /my-spending | Rate limit tercapai | HTTP 429: `{"error": "Terlalu banyak percobaan. Coba lagi dalam 1 menit."}` |
| Aktivasi Periode | Periode tidak ditemukan | HTTP 404 |

---

### 3.6 Security — Hal yang Belum Tercakup PRD v1.0

| Risiko | Mitigasi |
|--------|----------|
| **Brute-force `/my-spending`** — siapapun yang tahu HP/email bisa enumerate data customer | Rate limiting: `throttle:5,1` (5 request/menit/IP) via Laravel middleware |
| **CSRF Attack** pada semua form POST | Laravel sudah handle via `@csrf` di Blade + `VerifyCsrfToken` middleware — pastikan tidak dimatikan |
| **SQL Injection pada autocomplete** | Gunakan `DB::select()` dengan parameter binding, TIDAK concatenate string |
| **OTP brute-force** | Max 3 percobaan OTP per sesi, TTL OTP 5 menit, rate limit request OTP baru |
| **Mass Assignment** di Eloquent | Definisikan `$fillable` eksplisit di setiap Model, jangan gunakan `$guarded = []` |
| **Password plain text** | Selalu `bcrypt()` atau `Hash::make()` — Laravel default sudah benar |
| **Akses lintas guard** | Pastikan route admin hanya bisa diakses guard `admin`, route kasir hanya guard `kasir` via middleware |

---

### 3.7 Wireframe — Inkonsistensi dengan Sitemap

Navbar di Wireframe 14.1 (Landing Page) tidak mencantumkan link `/my-spending`:

**PRD v1.0 (salah):**
```
NAVBAR: [Logo Mayang] [Leaderboard] [Daftar]
```

**Koreksi:**
```
NAVBAR: [Logo Mayang] [Leaderboard] [Cek Belanjaanku] [Daftar Member]
```

Link `/my-spending` harus ada di navbar karena ini salah satu fitur utama yang mengdorong customer kembali ke sistem.

---

## 4. Database Schema Final (Revised)

> Seluruh schema ditulis dalam **PostgreSQL syntax** untuk Supabase.  
> Perbedaan utama dari PRD v1.0 (MySQL): `BIGSERIAL` menggantikan `BIGINT AUTO_INCREMENT`, `BOOLEAN` menggantikan `TINYINT(1)`, `TEXT` menggantikan `VARCHAR` untuk kolom panjang, `ENUM` digantikan dengan `TEXT` + `CHECK constraint`, dan `TIMESTAMPTZ` digunakan untuk timezone-awareness.

```sql
-- ============================================================
-- MAYANG TOP SPENDER SYSTEM — DATABASE SCHEMA v1.2
-- PostgreSQL 15+ (Supabase)
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- Aktifkan ekstensi trigram untuk autocomplete search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- TABEL: users (Admin & Kasir)
-- ============================================================
CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    password   TEXT NOT NULL,
    role       TEXT NOT NULL DEFAULT 'kasir'
                   CHECK (role IN ('admin', 'kasir')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABEL: customers (Pelanggan/Member)
-- ============================================================
CREATE TABLE customers (
    id            BIGSERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    phone         TEXT NOT NULL UNIQUE,
    registered_by BIGINT NULL,   -- NULL = self-register, filled = kasir user_id
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- TABEL: periods (Periode Kompetisi Top Spender)
-- ============================================================
CREATE TABLE periods (
    id         BIGSERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date   DATE NOT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL,   -- soft delete
    CONSTRAINT chk_period_dates CHECK (end_date >= start_date)
);

-- ============================================================
-- TABEL: transactions (Transaksi Belanja)
-- ============================================================
CREATE TABLE transactions (
    id              BIGSERIAL PRIMARY KEY,
    customer_id     BIGINT NOT NULL,
    period_id       BIGINT NOT NULL,
    cashier_id      BIGINT NULL,           -- nullable: SET NULL jika kasir dihapus
    amount          NUMERIC(15,2) NOT NULL,
    notes           TEXT NULL,
    original_amount NUMERIC(15,2) NULL,    -- nilai amount sebelum diedit (audit trail)
    edited_by       BIGINT NULL,           -- user_id yang melakukan edit
    edited_at       TIMESTAMPTZ NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_amount_positive CHECK (amount > 0),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (period_id)   REFERENCES periods(id)   ON DELETE RESTRICT,
    FOREIGN KEY (cashier_id)  REFERENCES users(id)      ON DELETE SET NULL
);

-- ============================================================
-- TABEL: otp_verifications (OTP WhatsApp untuk /my-spending)
-- ============================================================
CREATE TABLE otp_verifications (
    id         BIGSERIAL PRIMARY KEY,
    phone      TEXT NOT NULL,
    otp_code   TEXT NOT NULL,
    purpose    TEXT NOT NULL DEFAULT 'my_spending'
                   CHECK (purpose IN ('my_spending')),
    is_used    BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRIGGER: auto-update updated_at pada setiap UPDATE
-- PostgreSQL tidak punya ON UPDATE CURRENT_TIMESTAMP seperti MySQL
-- Harus pakai trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Pasang trigger ke tabel yang punya updated_at
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_periods_updated_at
    BEFORE UPDATE ON periods
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- INDEX untuk Performa
-- ============================================================

-- Standard B-tree indexes
CREATE INDEX idx_transactions_period          ON transactions(period_id);
CREATE INDEX idx_transactions_customer        ON transactions(customer_id);
CREATE INDEX idx_transactions_period_customer ON transactions(period_id, customer_id);
CREATE INDEX idx_transactions_cashier         ON transactions(cashier_id);
CREATE INDEX idx_transactions_created         ON transactions(created_at);
CREATE INDEX idx_periods_active               ON periods(is_active);
CREATE INDEX idx_periods_deleted              ON periods(deleted_at);
CREATE INDEX idx_customers_phone              ON customers(phone);
CREATE INDEX idx_customers_email              ON customers(email);
CREATE INDEX idx_otp_phone                    ON otp_verifications(phone);
CREATE INDEX idx_otp_expires                  ON otp_verifications(expires_at);

-- GIN trigram indexes untuk autocomplete kasir (LIKE '%keyword%' dengan index)
CREATE INDEX idx_customers_name_trgm  ON customers USING GIN (name  gin_trgm_ops);
CREATE INDEX idx_customers_phone_trgm ON customers USING GIN (phone gin_trgm_ops);
CREATE INDEX idx_customers_email_trgm ON customers USING GIN (email gin_trgm_ops);
```

### Perbedaan Syntax MySQL → PostgreSQL (Referensi Cepat)

| Fitur | MySQL (PRD v1.0) | PostgreSQL (Revised) |
|-------|-----------------|----------------------|
| Auto increment PK | `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY` | `BIGSERIAL PRIMARY KEY` |
| Boolean | `TINYINT(1) DEFAULT 0` | `BOOLEAN DEFAULT FALSE` |
| Enum/role | `ENUM('admin','kasir')` | `TEXT CHECK (role IN ('admin','kasir'))` |
| Desimal uang | `DECIMAL(15,2)` | `NUMERIC(15,2)` |
| String panjang | `VARCHAR(255)` | `TEXT` |
| Timestamp + timezone | `TIMESTAMP` | `TIMESTAMPTZ` |
| Auto-update timestamp | `ON UPDATE CURRENT_TIMESTAMP` | Trigger `set_updated_at()` |
| Case-insensitive search | `LIKE` (case-sensitive) | `ILIKE` (built-in) |
| Trigram search | `FULLTEXT INDEX` | `GIN index + pg_trgm` |
| Format angka | `FORMAT(amount, 0)` | `TO_CHAR(amount, 'FM999,999,999')` atau handle di frontend |
| Tanggal hari ini | `CURDATE()` | `CURRENT_DATE` |
| Waktu sekarang | `NOW()` | `NOW()` (sama) |

---

## 5. Query SQL Final (Revised)

> Semua query ditulis dalam **PostgreSQL syntax**.  
> Formatting Rupiah (`TO_CHAR`) digunakan sebagai pengganti `FORMAT()` dari MySQL.

### 5.1 Leaderboard Top Spender

```sql
-- PostgreSQL — ROW_NUMBER() OVER() didukung native ✅
SELECT
    ROW_NUMBER() OVER (ORDER BY SUM(t.amount) DESC)          AS peringkat,
    c.name                                                    AS nama_lengkap,
    TO_CHAR(SUM(t.amount), 'FM999,999,999,999')               AS total_belanja,
    SUM(t.amount)                                             AS total_raw
FROM transactions t
JOIN customers c ON t.customer_id = c.id
JOIN periods   p ON t.period_id   = p.id
WHERE p.is_active = true
  AND p.deleted_at IS NULL
GROUP BY c.id, c.name
ORDER BY SUM(t.amount) DESC;
```

### 5.2 Dashboard Admin — Summary

```sql
-- Total customer terdaftar
SELECT COUNT(*) AS total_customer FROM customers;

-- Total transaksi & nominal periode aktif
SELECT
    COUNT(t.id)                                       AS total_transaksi,
    TO_CHAR(SUM(t.amount), 'FM999,999,999,999')        AS total_nominal,
    SUM(t.amount)                                      AS total_nominal_raw
FROM transactions t
JOIN periods p ON t.period_id = p.id
WHERE p.is_active = true
  AND p.deleted_at IS NULL;

-- Top 5 Spender periode aktif (untuk dashboard card)
SELECT
    ROW_NUMBER() OVER (ORDER BY SUM(t.amount) DESC)   AS peringkat,
    c.name                                             AS nama,
    TO_CHAR(SUM(t.amount), 'FM999,999,999,999')        AS total_belanja
FROM transactions t
JOIN customers c ON t.customer_id = c.id
JOIN periods   p ON t.period_id   = p.id
WHERE p.is_active = true
  AND p.deleted_at IS NULL
GROUP BY c.id, c.name
ORDER BY SUM(t.amount) DESC
LIMIT 5;
```

### 5.3 Autocomplete Customer (Kasir) — GIN Trigram

```sql
-- PostgreSQL ILIKE + GIN trigram index → pencarian '%keyword%' TETAP pakai index ✅
SELECT id, name, email, phone
FROM customers
WHERE name  ILIKE '%' || $1 || '%'
   OR phone ILIKE '%' || $1 || '%'
   OR email ILIKE '%' || $1 || '%'
ORDER BY
    -- Prioritaskan exact match dan prefix match
    CASE
        WHEN name  ILIKE $1 || '%' THEN 1
        WHEN phone ILIKE $1 || '%' THEN 1
        WHEN email ILIKE $1 || '%' THEN 1
        ELSE 2
    END
LIMIT 10;
```

```php
// Di Laravel — gunakan parameter binding dengan named placeholder
$results = DB::select("
    SELECT id, name, email, phone
    FROM customers
    WHERE name  ILIKE :kw
       OR phone ILIKE :kw
       OR email ILIKE :kw
    LIMIT 10
", ['kw' => '%' . $keyword . '%']);
```

### 5.4 History Belanja Customer

```sql
SELECT
    t.created_at                                          AS tanggal,
    t.amount                                              AS nominal,
    t.original_amount                                     AS nominal_sebelum_edit,
    t.notes                                               AS catatan,
    p.name                                                AS periode,
    TO_CHAR(t.created_at AT TIME ZONE 'Asia/Jakarta', 'DD Mon YYYY HH24:MI') AS tanggal_display
FROM transactions t
JOIN periods p ON t.period_id = p.id
WHERE t.customer_id = $1
ORDER BY t.created_at DESC;
```

### 5.5 Aktivasi Periode (Atomic via Transaction)

```sql
-- PostgreSQL transaction syntax
BEGIN;
  UPDATE periods SET is_active = false WHERE deleted_at IS NULL;
  UPDATE periods SET is_active = true  WHERE id = $1 AND deleted_at IS NULL;
COMMIT;
```

```php
// Implementasi di Laravel — DB::transaction() untuk atomicity
DB::transaction(function () use ($periodId) {
    DB::statement('UPDATE periods SET is_active = false WHERE deleted_at IS NULL');
    DB::statement('UPDATE periods SET is_active = true  WHERE id = ? AND deleted_at IS NULL', [$periodId]);
});
```

### 5.6 Edit Transaksi (Audit Trail)

```sql
-- PostgreSQL syntax — COALESCE untuk simpan original_amount pertama kali saja
UPDATE transactions
SET
    original_amount = COALESCE(original_amount, amount),  -- hanya simpan nilai pertama
    amount          = $1,
    edited_by       = $2,
    edited_at       = NOW(),
    notes           = $3,
    updated_at      = NOW()
WHERE id = $4;
```

```php
// Validasi hak akses di Laravel Policy (lebih tepat dari SQL logic)
// app/Policies/TransactionPolicy.php

public function update(User $user, Transaction $transaction): bool
{
    // Admin bisa edit semua transaksi
    if ($user->role === 'admin') return true;

    // Kasir hanya bisa edit transaksi miliknya sendiri, hari yang sama
    return $user->role === 'kasir'
        && $transaction->cashier_id === $user->id
        && $transaction->created_at->isToday();
}
```

### 5.7 Cleanup OTP Kadaluarsa (Scheduled Job)

```sql
-- Hapus OTP yang sudah expired atau sudah digunakan (jalankan via Laravel Scheduler)
DELETE FROM otp_verifications
WHERE expires_at < NOW()
   OR is_used = true;
```

```php
// app/Console/Kernel.php
$schedule->statement("
    DELETE FROM otp_verifications WHERE expires_at < NOW() OR is_used = true
")->hourly();
```

---

## 6. Use Case Tambahan (Addendum)

### UC-K06 — Edit Transaksi (Kasir)

| Atribut | Detail |
|---------|--------|
| **ID** | UC-K06 |
| **Aktor** | Kasir |
| **Nama** | Edit Transaksi Sendiri |
| **Precondition** | Kasir sudah login. Transaksi yang akan diedit adalah milik kasir tersebut dan dibuat pada hari yang sama (H+0). |
| **Flow Utama** | 1. Kasir buka halaman `/kasir/transaksi/history` → 2. Temukan transaksi hari ini → 3. Klik tombol "Edit" → 4. Ubah nominal (dan/atau catatan) → 5. Submit → 6. Sistem simpan perubahan dengan audit trail |
| **Postcondition** | Nominal transaksi diperbarui. `original_amount` tersimpan. Leaderboard otomatis ter-update. |
| **Exception** | Jika transaksi bukan milik kasir ini atau bukan hari ini → sistem menolak dengan pesan "Anda tidak memiliki izin untuk mengedit transaksi ini." |

### UC-A08 — Edit Transaksi (Admin)

| Atribut | Detail |
|---------|--------|
| **ID** | UC-A08 |
| **Aktor** | Admin |
| **Nama** | Edit Semua Transaksi |
| **Precondition** | Admin sudah login. |
| **Flow Utama** | 1. Admin buka `/admin/transaksi` → 2. Cari transaksi yang akan diedit → 3. Klik "Edit" → 4. Ubah nominal dan/atau catatan → 5. Submit |
| **Postcondition** | Nominal diperbarui dengan audit trail. Tidak ada batasan hari. |

### UC-C04 — Verifikasi OTP WhatsApp

| Atribut | Detail |
|---------|--------|
| **ID** | UC-C04 |
| **Aktor** | Customer |
| **Nama** | Verifikasi OTP WhatsApp untuk /my-spending |
| **Precondition** | Customer punya nomor HP yang terdaftar di sistem |
| **Flow Utama** | 1. Customer buka `/my-spending` → 2. Input nomor HP → 3. Sistem kirim OTP 6 digit via WhatsApp → 4. Customer input OTP → 5. Sistem validasi → 6. Data history belanja ditampilkan |
| **Exception** | OTP expired (>5 menit) → error + opsi kirim ulang. OTP salah > 3x → block 5 menit. |

---

## 7. Fitur Baru: OTP WhatsApp (/my-spending)

### Alur Teknis

```
Customer input HP
      ↓
Sistem cek: phone ada di tabel customers?
      ↓ YA
Generate OTP (6 digit random)
      ↓
Simpan ke tabel otp_verifications (expires_at = NOW() + 5 menit)
      ↓
Kirim via WhatsApp API (Fonnte/Wablas/Zenziva)
      ↓
Customer input OTP di form
      ↓
Sistem validasi: otp_code cocok? is_used = 0? expires_at > NOW()?
      ↓ VALID
Mark is_used = 1
      ↓
Tampilkan history belanja customer
```

### Rekomendasi WhatsApp API Provider (Indonesia)

| Provider | Harga | Catatan |
|----------|-------|---------|
| **Fonnte** | ~Rp 50/pesan | Paling populer di Indonesia, dokumentasi bagus |
| **Wablas** | ~Rp 45/pesan | Alternatif Fonnte |
| **Zenziva** | Per paket | Lebih enterprise |

### Environment Variable yang Dibutuhkan

```env
WHATSAPP_PROVIDER=fonnte
WHATSAPP_API_KEY=your_api_key_here
WHATSAPP_SENDER=628xxxxxxxxxx  # nomor pengirim
OTP_TTL_MINUTES=5
OTP_MAX_ATTEMPTS=3
```

---

## 8. Fitur Baru: Edit Transaksi oleh Kasir

### Aturan Bisnis (Dikonfirmasi)

| Rule | Detail |
|------|--------|
| **Kasir** | Hanya bisa edit transaksi milik sendiri (`cashier_id = auth()->id()`) pada hari yang sama (`created_at::date = CURRENT_DATE`) |
| **Admin** | Bisa edit semua transaksi tanpa batasan hari |
| **Audit Trail** | Nilai `amount` sebelum edit disimpan di kolom `original_amount` (hanya disimpan pertama kali) |
| **Leaderboard** | Otomatis ter-update karena leaderboard di-query real-time dari tabel transactions |

### Halaman yang Perlu Ditambahkan

| URL | Deskripsi |
|-----|-----------|
| `/kasir/transaksi/{id}/edit` | Form edit transaksi (kasir, batasan hari yang sama) |
| `/admin/transaksi/{id}/edit` | Form edit transaksi (admin, tanpa batasan) |

---

## 9. Sitemap Final (Revised)

### Public Pages (Tanpa Login)

| URL | Deskripsi | Perubahan dari PRD v1.0 |
|-----|-----------|------------------------|
| `/` | Landing page — info Top Spender, CTA ke leaderboard, daftar, cek belanja | Tambah link ke `/my-spending` di navbar |
| `/register` | Form registrasi customer mandiri | Tidak berubah |
| `/leaderboard` | Leaderboard publik periode aktif | Tidak berubah |
| `/my-spending` | Cek history belanja via OTP WhatsApp | **Diperbarui:** tambah OTP flow |
| `/login` | Login untuk Admin & Kasir | Tidak berubah |

### Kasir Pages (Login Required — Guard: kasir)

| URL | Deskripsi | Perubahan |
|-----|-----------|-----------|
| `/kasir/transaksi` | Form input transaksi baru | Tidak berubah |
| `/kasir/transaksi/history` | History transaksi kasir ini | Tambah tombol "Edit" untuk transaksi hari ini |
| `/kasir/transaksi/{id}/edit` | Form edit transaksi | **BARU** |
| `/kasir/customer/create` | Form daftar customer baru | Tidak berubah |

### Admin Pages (Login Required — Guard: admin)

| URL | Deskripsi | Perubahan |
|-----|-----------|-----------|
| `/admin/dashboard` | Dashboard overview | Tidak berubah |
| `/admin/periode` | Daftar semua periode | Tampilkan soft-deleted di bagian bawah (opsional) |
| `/admin/periode/create` | Form buat periode baru | Tambah validasi `start_date < end_date` |
| `/admin/kasir` | Daftar semua akun kasir | Tidak berubah |
| `/admin/kasir/create` | Form tambah kasir baru | Tidak berubah |
| `/admin/kasir/{id}/reset-password` | Reset password kasir | **BARU** |
| `/admin/transaksi` | History semua transaksi | Tambah tombol "Edit" |
| `/admin/transaksi/{id}/edit` | Form edit transaksi | **BARU** |
| `/admin/customer` | Daftar semua customer | Tidak berubah |

---

## 10. Hal yang Belum Ditentukan (Update dari Bab 5 PRD)

Tabel ini merupakan update dari Bab 5 PRD v1.0. Item yang sudah dikonfirmasi ditandai ✅.

| # | Parameter | Status | Nilai/Keputusan |
|---|-----------|--------|----------------|
| 1 | Nama periode pertama | ⏳ Belum | Perlu konfirmasi dari klien/owner Mayang |
| 2 | Tanggal periode pertama | ⏳ Belum | Perlu konfirmasi dari klien/owner Mayang |
| 3 | Jumlah kasir awal | ⏳ Belum | Perlu konfirmasi berapa staff toko |
| 4 | Branding & warna utama | ⏳ Belum | Perlu brand guideline Mayang (warna, font) |
| 5 | **Domain/hosting** | ✅ Dikonfirmasi | `loyalty.mayangmodestwear.com` |
| 6 | Minimum nominal transaksi | ⏳ Belum | Perlu konfirmasi: ada minimum? atau berapapun? |
| 7 | **Provider WhatsApp OTP** | ⏳ Belum | Pilih salah satu: Fonnte / Wablas / Zenziva |
| 8 | **Database engine** | ✅ Dikonfirmasi | PostgreSQL via **Supabase** (pivot dari MySQL) |

---

## 11. Priority Fix List

Semua item di bawah harus diselesaikan **sebelum mulai coding**.

### 🔴 Critical (Blocker — wajib fix sebelum implementasi)

| # | Item | Lokasi di PRD | Dampak jika Diabaikan |
|---|------|--------------|----------------------|
| C1 | Ganti `ON DELETE CASCADE` → `RESTRICT/SET NULL` di `transactions` | Bab 11 (DB Design) | Hapus kasir = hilang semua transaksinya |
| C2 | Tambah `CHECK (amount > 0)` di tabel `transactions` | Bab 11 (DB Design) | Kasir bisa input nominal Rp 0 |
| C3 | Tambah tabel `otp_verifications` untuk fitur /my-spending | Baru | Fitur OTP tidak bisa diimplementasi |
| C4 | Klarifikasi arsitektur: standalone app di `loyalty.mayangmodestwear.com` | Bab 1 (PRD) | Salah setup hosting/DNS |
| C5 | Setup Supabase project + jalankan schema v1.2 di SQL Editor | Baru | Developer tidak bisa connect ke database |

### 🟠 High (Harus ada di sprint pertama)

| # | Item | Dampak |
|---|------|--------|
| H1 | Implementasi rate limiting pada `/my-spending` (throttle 5/menit) | Privacy & security |
| H2 | Tambah UC edit transaksi (UC-K06, UC-A08) ke PRD | Feature completeness |
| H3 | Tambah soft delete (`deleted_at`) pada tabel `periods` | Audit trail |
| H4 | Kolom audit di `transactions` (`original_amount`, `edited_by`, `edited_at`) | Edit transaction feature |
| H5 | Validasi `start_date < end_date` di form periode (DB constraint + Laravel validation) | Data integrity |

### 🟡 Medium (Sprint kedua)

| # | Item | Dampak |
|---|------|--------|
| M1 | Aktifkan ekstensi `pg_trgm` di Supabase + buat GIN index untuk autocomplete | Performance |
| M2 | Tambah fitur reset password kasir (UC-A10) | Operasional |
| M3 | Gunakan DB::transaction() untuk operasi aktivasi periode | Atomicity |
| M4 | Pisahkan 2 auth guard (admin vs kasir) di Laravel | Security |
| M5 | Setup Laravel Scheduler untuk cleanup OTP kadaluarsa (query 5.7) | Maintenance |

### 🟢 Low (Nice to have)

| # | Item | Dampak |
|---|------|--------|
| L1 | Tambah link `/my-spending` di navbar wireframe | UI consistency |
| L2 | Tambah `updated_at` pada `transactions` | Laravel standard |
| L3 | Dokumentasikan `cashier_id` nullable sebagai intentional | Code clarity |

---

## 12. Changelog dari PRD v1.0

| Versi | Tanggal | Author | Perubahan |
|-------|---------|--------|-----------|
| v1.0 | 19 Juni 2026 | Ferdiansyah + Claude AI | Dokumen brainstorming awal |
| v1.1 | 22 Juni 2026 | Ferdiansyah + Claude AI | Gap analysis & koreksi kritis: perbaikan FK cascade, tambah OTP WhatsApp, tambah fitur edit transaksi, hybrid ORM approach, fulltext index, audit trail, soft delete periods, rate limiting |
| v1.2 | 22 Juni 2026 | Ferdiansyah + Claude AI | Pivot database engine: MySQL → PostgreSQL via Supabase. Konversi seluruh schema (BIGSERIAL, BOOLEAN, TEXT, TIMESTAMPTZ, trigger updated_at) dan query (ILIKE, TO_CHAR, GIN pg_trgm, CURRENT_DATE). Tambah koneksi Laravel-Supabase config, cleanup OTP scheduler, Transaction Policy. |

---

> **Langkah Selanjutnya:**
> 1. Buat Supabase project baru → copy connection string ke `.env` Laravel
> 2. Jalankan schema v1.2 (Bab 4) di Supabase SQL Editor
> 3. Konfirmasi 4 item yang masih belum ditentukan (Bab 10)
> 4. Pilih provider WhatsApp OTP (Fonnte direkomendasikan)
> 5. Setup project Laravel + konfigurasi subdomain `loyalty.mayangmodestwear.com`
> 6. Mulai development dengan urutan: Auth → Customer → Period → Transaction → Leaderboard → OTP

---

*Mayang Top Spender System — PRD Gap Analysis v1.2*  
*Dibuat oleh: Ferdiansyah | Dibantu oleh: Claude AI (Anthropic)*  
*Tanggal: 22 Juni 2026*