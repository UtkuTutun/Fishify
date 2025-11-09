<<<<<<< HEAD
# Fishify
=======
# 🎣 Fishify — Balıkçılık & Ekonomi Discord Oyunu

Fishify, Discord sunucunda arkadaşlarınla birlikte balık tutabileceğin, koleksiyonunu büyütebileceğin ve ekonomiyle yarışabileceğin bir balıkçılık oyunudur!

---

## 📦 Oyun Verileri

### 🐟 Balıklar

| Emoji | İsim     | Nadirlik | Açıklama                        | Ağırlık (kg)   | Fiyat (Baz + kg başı) | Yakalanma Şansı |
|-------|----------|----------|---------------------------------|----------------|----------------------|-----------------|
| 🐟    | Hamsi    | Yaygın   | Küçük ama lezzetli bir balık.   | 0.05 - 0.2     | 2₺ + 5₺/kg           | %35             |
| 🐠    | Sazan    | Yaygın   | Tatlı su balıklarının en bilinenlerinden. | 0.5 - 3       | 3₺ + 8₺/kg           | %25             |
| 🐡    | Levrek   | Yaygın   | Denizlerin hızlı avcısı.         | 0.3 - 2        | 4₺ + 10₺/kg          | %20             |
| 🎣    | Turna    | Nadir    | Uzun ve yırtıcı bir balık.      | 1 - 7          | 10₺ + 25₺/kg         | %12             |
| 🦈    | Alabalık | Nadir    | Soğuk suların gözdesi.          | 0.2 - 1.5      | 12₺ + 30₺/kg         | %8              |

### 🏅 Nadirlikler

| Emoji | İsim     | Renk      | Şans (%) |
|-------|----------|-----------|----------|
| ⚪    | Yaygın   | #A0A0A0   | 70       |
| 🔵    | Nadir    | #3498db   | 25       |
| 🟣    | Efsanevi | #9b59b6   | 5        |

---

## � Ekonomi & Kullanıcı Verileri

- Para birimi: **Lira (₺)**
- Her balık avında, balığın türüne ve ağırlığına göre para kazanırsın.
- Kullanıcı verileri: bakiye, toplam balık sayısı, toplam balık kilosu, kayıt tarihi.
- Günlük transfer limiti: **1000₺**
- Transfer limiti her gece 00:00'da (Türkiye saati) sıfırlanır.

---

## 🏛️ Sunucu Verileri

- Her sunucunun kendine özel prefix'i olabilir (varsayılan: `!`).
- Komutların kullanılabileceği kanallar yönetici tarafından belirlenebilir.

---

## 🛠️ Komutlar

### 🎣 Balıkçılık Komutları
- **!fish** — Balık tut, rastgele bir balık yakala ve para kazan.
- **!baliklar** — Tüm balıkları ve özelliklerini listele.
- **!rarities** — Balık nadirliklerini ve şanslarını göster.

### 💰 Ekonomi Komutları
- **!bakiye [@kullanıcı]** — Kendi veya etiketlenen kullanıcının bakiyesini göster.
- **!gonder @kullanıcı miktar** — Bir kullanıcıya para gönder (günlük limitli).
- **!profil [@kullanıcı]** — Oyun profilini ve istatistiklerini göster.
- **!siralama** — En zengin oyuncuları sırala.

### 🛡️ Yönetim Komutları
- **!kanalekle [#kanal]** — Komutların kullanılabileceği bir kanal ekle (Yönetici).
- **!kanalkaldır [#kanal]** — Kanalı izinli kanallardan çıkar (Yönetici).
- **!kanallar** — İzinli kanalların listesini göster.
- **!kanalseç [#kanal|kanalID|isim]** — Birden fazla kanalı izinli kanallara ekle (Yönetici).
- **!prefixdeğiştir <yeniPrefix>** — Sunucu prefixini değiştir (Yönetici).
- **!komutlar** — Tüm komutları ve açıklamalarını kategorize şekilde göster.
- **!ping** — Botun pingini gösterir.

---

## � Kullanıcı Modeli

- **userId**: Discord kullanıcı ID'si
- **balance**: Bakiye (₺)
- **createdAt**: Kayıt tarihi
- **totalFishCount**: Toplam yakalanan balık sayısı
- **totalFishKg**: Toplam yakalanan balık kilosu

## � Sunucu Modeli

- **guildId**: Sunucu ID'si
- **prefix**: Komut prefix'i
- **allowedChannels**: Komutların kullanılabildiği kanal ID'leri

---

## ℹ️ Ek Bilgiler

- Komutlar sadece izinli kanallarda çalışır (bazı yönetim komutları hariç).
- Herkes kendi profilini ve istatistiklerini görebilir.
- Balıklar, nadirlikler ve ekonomi tamamen dinamik ve günceldir.

---

🎣 **Fishify ile Discord'da balıkçılık ve ekonomi heyecanını yaşa!**  
Her gün yeni bir macera, yeni bir balık ve yeni bir rekabet seni bekliyor!

---
>>>>>>> 56f3e48 (İlk yükleme: Fishify balıkçılık botu, kurulum ve oyun verileriyle birlikte.)
