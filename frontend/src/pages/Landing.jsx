import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Plus,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  PawPrint,
  User,
  Mail,
  Clock,
  Calendar,
  DollarSign,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Landing = () => {
  const [penitipanData, setPenitipanData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPenitipanData = async () => {
    try {
      const response = await axios.get("http://backend.test/api/penitipan/");
      setPenitipanData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPenitipanData();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAmbilModalOpen, setIsAmbilModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [minDate, setMinDate] = useState("");
  const itemsPerPage = 6;

  // State for ambil hewan
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [biaya, setBiaya] = useState(0);
  const biayaPerJam = 100000;

  const categories = [
    ...new Set(penitipanData.map((item) => item.jenis_hewan)),
  ];

  const [formData, setFormData] = useState({
    petName: "",
    ownerName: "",
    phoneNumber: "",
    email: "",
    jenis_hewan: "",
    Tanggal_Penitipan: "",
  });

  const filteredData = useMemo(() => {
    return penitipanData.filter((item) => {
      const matchesSearch =
        item.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.petName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "" || item.jenis_hewan === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [penitipanData, searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSubmit = async () => {
    if (
      !formData.petName ||
      !formData.ownerName ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.jenis_hewan ||
      !formData.Tanggal_Penitipan
    ) {
      toast("Harap lengkapi semua field yang wajib diisi");
      return;
    }

    try {
      const response = await axios.post(
        "http://backend.test/api/penitipan",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setFormData({
        petName: "",
        ownerName: "",
        phoneNumber: "",
        email: "",
        jenis_hewan: "",
        Tanggal_Penitipan: "",
      });

      setIsModalOpen(false);
      toast.success("Data berhasil ditambahkan");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan!");
    } finally {
      fetchPenitipanData();
    }
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  const handleSave = async () => {
    if (!selectedDate) {
      toast("Harap pilih tanggal pengambilan terlebih dahulu");
      return;
    }

    try {
      await axios.patch(
        `http://backend.test/api/penitipan/${selectedPet.id}`,
        {
          Tanggal_Pengambilan: selectedDate,
          biaya: biaya,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Pengambilan hewan berhasil dikonfirmasi");
      setIsAmbilModalOpen(false);
      setSelectedDate("");
      setBiaya(0);

      fetchPenitipanData();
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat konfirmasi pengambilan");
    }
  };

  // Format date YYYY-MM-DD
  const formatToInputDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Hitung durasi dan biaya otomatis saat tanggal dipilih
  useEffect(() => {
    if (selectedDate && selectedPet) {
      const start = new Date(selectedPet.Tanggal_Penitipan);
      const end = new Date(selectedDate);

      const diffMs = end - start;
      const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

      setBiaya(diffHours > 0 ? diffHours * biayaPerJam : 0);
    }
  }, [selectedDate, selectedPet]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Penitipan Hewan
          </h1>
          <p className="text-gray-600">Aplikasi penitipan hewan peliharaan</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">
                      Pet Name: {item.petName}
                    </p>

                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.jenis_hewan}
                    </h3>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Pet Owner: {item.ownerName}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tanggal Penitipan:</span>
                  <span className="font-medium text-gray-900">
                    {item.Tanggal_Penitipan}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tanggal Pengambilan:</span>
                  <span className="font-medium text-gray-900">
                    {item.Tanggal_Pengambilan || "-"}
                  </span>
                </div>
              </div>
              {!item.Tanggal_Pengambilan && (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setIsAmbilModalOpen(true);
                      setSelectedPet(item);
                    }}
                    className="bg-green-500 p-2 rounded-xl text-white font-semibold border border-black "
                  >
                    Ambil Hewan!
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Add Data Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 backdrop-blur-2xl  bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Tambah Data Baru
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Hewan
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.jenis_hewan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jenis_hewan: e.target.value,
                        })
                      }
                    >
                      <option value="">Pilih jenis hewan</option>
                      <option value="Anjing">Anjing</option>
                      <option value="Kucing">Kucing</option>
                      <option value="Kelinci">Kelinci</option>
                      <option value="Reptil">Reptil</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Pemilik
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.ownerName}
                      onChange={(e) =>
                        setFormData({ ...formData, ownerName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Hewan
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.petName}
                      onChange={(e) =>
                        setFormData({ ...formData, petName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Pemilik
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu Penitipan
                    </label>
                    <input
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="date"
                      min={minDate}
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Tanggal_Penitipan: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ambil Modal */}
        {isAmbilModalOpen && (
          <div className="fixed inset-0  backdrop-blur-2xl bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <PawPrint className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Ambil Hewan Peliharaan
                    </h2>
                    <p className="text-sm text-gray-600">
                      Konfirmasi pengambilan dan pembayaran
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAmbilModalOpen(false)}
                  className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Data Hewan */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <PawPrint className="w-4 h-4" />
                    Data Hewan Peliharaan
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Jenis Hewan:
                      </span>
                      <span className="font-medium text-gray-900">
                        {selectedPet.jenis_hewan}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Nama Hewan:</span>
                      <span className="font-medium text-gray-900">
                        {selectedPet.petName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Data Pemilik */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Data Pemilik
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Nama Pemilik</p>
                        <p className="font-medium text-gray-900">
                          {selectedPet.ownerName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">
                          {selectedPet.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Periode Penitipan */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Periode Penitipan
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Masuk</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedPet.Tanggal_Penitipan).toLocaleString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input Tanggal Pengambilan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Tanggal Pengambilan
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    min={formatToInputDate(selectedPet.Tanggal_Penitipan)}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pilih tanggal ketika Anda akan mengambil hewan peliharaan
                  </p>
                </div>

                {/* Rincian Biaya */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Rincian Biaya
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Biaya per jam:
                      </span>
                      <span className="font-medium text-gray-900">
                        Rp {biayaPerJam.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Durasi:</span>
                      <span className="font-medium text-gray-900">
                        {biaya > 0 ? Math.ceil(biaya / biayaPerJam) : 0} jam
                      </span>
                    </div>
                    <div className="border-t border-green-200 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900">
                          Total Biaya:
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          Rp {biaya.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setIsAmbilModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 font-medium"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!selectedDate}
                  className={`flex-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedDate
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {selectedDate
                    ? "Konfirmasi & Bayar"
                    : "Pilih Tanggal Terlebih Dahulu"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
