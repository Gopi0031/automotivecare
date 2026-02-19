"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./styles.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [detailedServices, setDetailedServices] = useState([]);
  const [specialServices, setSpecialServices] = useState([]);
  const [vehicleBrands, setVehicleBrands] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [carBrands, setCarBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [editingDetailedService, setEditingDetailedService] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingCarBrand, setEditingCarBrand] = useState(null);
  const [editingCarModel, setEditingCarModel] = useState(null);
  const [editingSpecialService, setEditingSpecialService] = useState(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showDetailedServiceForm, setShowDetailedServiceForm] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showCarBrandForm, setShowCarBrandForm] = useState(false);
  const [showCarModelForm, setShowCarModelForm] = useState(false);
  const [showSpecialServiceForm, setShowSpecialServiceForm] = useState(false);
  const [previewHero, setPreviewHero] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [detailedPreviewHero, setDetailedPreviewHero] = useState(null);
  const [detailedPreviewContent, setDetailedPreviewContent] = useState(null);
  const router = useRouter();

  // ── existing services form (unchanged) ───────────────────────────────────
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    features: "",
    order: 0,
    image: "",
    cloudinaryPublicId: "",
  });

  // ── NEW: detailed services form (hero + content image + tagline + content) ─
  const [detailedServiceForm, setDetailedServiceForm] = useState({
    name: "",
    tagline: "",
    description: "",
    content: "",
    features: "",
    order: 0,
    image: "",
    cloudinaryPublicId: "",
    contentImage: "",
    contentImagePublicId: "",
  });

  const [brandForm, setBrandForm] = useState({ name: "", models: "" });

  const [carBrandForm, setCarBrandForm] = useState({
    name: "",
    logo: "",
    cloudinaryPublicId: "",
  });

  const [carModelForm, setCarModelForm] = useState({
    brand: "",
    name: "",
    image: "",
    cloudinaryPublicId: "",
    serviceCount: 6,
  });

  const [specialServiceForm, setSpecialServiceForm] = useState({
    name: "",
    tagline: "",
    description: "",
    content: "",
    heroImage: "",
    heroImagePublicId: "",
    contentImage: "",
    contentImagePublicId: "",
    order: 0,
  });

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      router.push("/admin-login");
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, imagesRes, servicesRes, detailedServicesRes, brandsRes, carBrandsRes, modelsRes, specialServicesRes] = await Promise.all([
        fetch("/api/bookings").catch(() => ({ ok: false })),
        fetch("/api/cloudinary-images").catch(() => ({ ok: false })),
        fetch("/api/services").catch(() => ({ ok: false })),
        fetch("/api/detailed-services").catch(() => ({ ok: false })),
        fetch("/api/vehicle-brands").catch(() => ({ ok: false })),
        fetch("/api/car-brands").catch(() => ({ ok: false })),
        fetch("/api/car-models").catch(() => ({ ok: false })),
        fetch("/api/special-services").catch(() => ({ ok: false })),
      ]);

      if (bookingsRes.ok) setBookings((await bookingsRes.json()).bookings || []);
      if (imagesRes.ok) setHeroImages((await imagesRes.json()).images || []);
      if (servicesRes.ok) setServices((await servicesRes.json()).services || []);
      if (detailedServicesRes.ok) setDetailedServices((await detailedServicesRes.json()).services || []);
      if (brandsRes.ok) setVehicleBrands((await brandsRes.json()).brands || []);
      if (carBrandsRes.ok) setCarBrands((await carBrandsRes.json()).brands || []);
      if (modelsRes.ok) setCarModels((await modelsRes.json()).models || []);
      if (specialServicesRes.ok) setSpecialServices((await specialServicesRes.json()).services || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin-login");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleServiceImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleCarBrandLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleCarModelImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Shared Cloudinary upload helper
  const uploadToCloudinary = async (file, folder) => {
    const signatureRes = await fetch(`/api/upload-signature?folder=${folder}`);
    const signatureData = await signatureRes.json();
    if (signatureData.error) throw new Error(signatureData.error);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("timestamp", signatureData.timestamp);
    formData.append("signature", signatureData.signature);
    formData.append("api_key", signatureData.apiKey);
    formData.append("folder", signatureData.folder);

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
      { method: "POST", body: formData }
    );
    const result = await cloudinaryRes.json();
    if (result.error) throw new Error(result.error.message);
    return { url: result.secure_url, publicId: result.public_id };
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) return setMessage("Please select a file");

    setUploading(true);
    setMessage("");

    try {
      const signatureRes = await fetch(`/api/upload-signature?folder=automotive-carcare/hero-images`);
      const signatureData = await signatureRes.json();

      if (signatureData.error) throw new Error(signatureData.error);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("timestamp", signatureData.timestamp);
      formData.append("signature", signatureData.signature);
      formData.append("api_key", signatureData.apiKey);
      formData.append("folder", signatureData.folder);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      const result = await cloudinaryRes.json();
      if (result.error) throw new Error(result.error.message);

      setMessage("Image uploaded successfully!");
      setPreview(null);
      e.target.reset();
      fetchData();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to upload image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (publicId) => {
    if (!confirm("Delete this image?")) return;

    try {
      const response = await fetch("/api/cloudinary-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Image deleted successfully!");
        fetchData();
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error(data.error || "Failed to delete image");
      }
    } catch (error) {
      setMessage("Failed to delete image: " + error.message);
    }
  };

  // ── EXISTING SERVICES HANDLER (completely unchanged) ──────────────────────
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setUploading(true);

    try {
      const fileInput = document.querySelector('input[name="serviceImage"]');
      const file = fileInput?.files[0];

      let imageUrl = serviceForm.image;
      let publicId = serviceForm.cloudinaryPublicId;

      if (file) {
        const signatureRes = await fetch(`/api/upload-signature?folder=automotive-carcare/services`);
        const signatureData = await signatureRes.json();

        if (signatureData.error) throw new Error(signatureData.error);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("timestamp", signatureData.timestamp);
        formData.append("signature", signatureData.signature);
        formData.append("api_key", signatureData.apiKey);
        formData.append("folder", signatureData.folder);

        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        const result = await cloudinaryRes.json();
        if (result.error) throw new Error(result.error.message);

        imageUrl = result.secure_url;
        publicId = result.public_id;
      }

      if (editingService && !file && !serviceForm.image) {
        throw new Error("Please select an image or use the existing one");
      }

      const slug = serviceForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const method = editingService ? "PUT" : "POST";
      const body = editingService
        ? { ...serviceForm, image: imageUrl, cloudinaryPublicId: publicId, slug, _id: editingService._id }
        : { ...serviceForm, image: imageUrl, cloudinaryPublicId: publicId, slug };

      const response = await fetch("/api/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(editingService ? "✅ Service updated!" : "✅ Service added!");
        setShowServiceForm(false);
        setEditingService(null);
        setServiceForm({ name: "", description: "", features: "", order: 0, image: "", cloudinaryPublicId: "" });
        setPreview(null);
        await fetchData();
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error(data.error || "Failed to save service");
      }
    } catch (error) {
      setMessage("❌ Failed to save service: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm("Delete this service?")) return;
    try {
      const response = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        setMessage("Service deleted!");
        await fetchData();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Failed to delete service: " + error.message);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  // ── NEW: DETAILED SERVICES HANDLER ────────────────────────────────────────
  const handleDetailedServiceSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setUploading(true);

    try {
      const heroFile = document.querySelector('input[name="dsHeroImage"]')?.files[0];
      const contentFile = document.querySelector('input[name="dsContentImage"]')?.files[0];

      let heroUrl = detailedServiceForm.image;
      let heroPublicId = detailedServiceForm.cloudinaryPublicId;
      let contentUrl = detailedServiceForm.contentImage;
      let contentPublicId = detailedServiceForm.contentImagePublicId;

      if (heroFile) {
        const result = await uploadToCloudinary(heroFile, "automotive-carcare/detailed-services/hero");
        heroUrl = result.url;
        heroPublicId = result.publicId;
      }

      if (contentFile) {
        const result = await uploadToCloudinary(contentFile, "automotive-carcare/detailed-services/content");
        contentUrl = result.url;
        contentPublicId = result.publicId;
      }

      if (!heroUrl || !contentUrl) {
        throw new Error("Both hero image and content image are required");
      }

      const slug = detailedServiceForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const method = editingDetailedService ? "PUT" : "POST";
      const body = {
        ...detailedServiceForm,
        image: heroUrl,
        cloudinaryPublicId: heroPublicId,
        contentImage: contentUrl,
        contentImagePublicId: contentPublicId,
        slug,
        ...(editingDetailedService ? { _id: editingDetailedService._id } : {}),
      };

      const response = await fetch("/api/detailed-services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(editingDetailedService ? "✅ Service updated!" : "✅ Service added!");
        resetDetailedServiceForm();
        await fetchData();
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error(data.error || "Failed to save service");
      }
    } catch (error) {
      setMessage("❌ Failed to save service: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDetailedService = async (id) => {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await fetch(`/api/detailed-services?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Service deleted!");
        await fetchData();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ Failed to delete: " + error.message);
    }
  };

  const resetDetailedServiceForm = () => {
    setShowDetailedServiceForm(false);
    setEditingDetailedService(null);
    setDetailedServiceForm({
      name: "", tagline: "", description: "", content: "", features: "", order: 0,
      image: "", cloudinaryPublicId: "", contentImage: "", contentImagePublicId: "",
    });
    setDetailedPreviewHero(null);
    setDetailedPreviewContent(null);
  };
  // ─────────────────────────────────────────────────────────────────────────

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const modelsArray = brandForm.models.split(",").map((m) => m.trim()).filter((m) => m.length > 0);
      const method = editingBrand ? "PUT" : "POST";
      const body = editingBrand
        ? { ...brandForm, models: modelsArray, _id: editingBrand._id }
        : { ...brandForm, models: modelsArray };

      const response = await fetch("/api/vehicle-brands", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(editingBrand ? "Brand updated!" : "Brand added!");
        setShowBrandForm(false);
        setEditingBrand(null);
        setBrandForm({ name: "", models: "" });
        await fetchData();
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error(data.error || "Failed to save brand");
      }
    } catch (error) {
      setMessage("Failed to save brand: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!confirm("Delete this brand?")) return;
    try {
      const response = await fetch(`/api/vehicle-brands?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        setMessage("Brand deleted!");
        await fetchData();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Failed to delete brand: " + error.message);
    }
  };

  const handleCarBrandSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setUploading(true);

    try {
      const fileInput = document.querySelector('input[name="carBrandLogo"]');
      const file = fileInput?.files[0];

      let logoUrl = carBrandForm.logo;
      let publicId = carBrandForm.cloudinaryPublicId;

      if (file) {
        const signatureRes = await fetch(`/api/upload-signature?folder=automotive-carcare/car-brands`);
        const signatureData = await signatureRes.json();

        if (signatureData.error) throw new Error(signatureData.error);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("timestamp", signatureData.timestamp);
        formData.append("signature", signatureData.signature);
        formData.append("api_key", signatureData.apiKey);
        formData.append("folder", signatureData.folder);

        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        const result = await cloudinaryRes.json();
        if (result.error) throw new Error(result.error.message);

        logoUrl = result.secure_url;
        publicId = result.public_id;
      }

      if (!logoUrl || !publicId) {
        throw new Error("Please select a logo");
      }

      const method = editingCarBrand ? "PUT" : "POST";
      const body = editingCarBrand
        ? { ...carBrandForm, logo: logoUrl, cloudinaryPublicId: publicId, _id: editingCarBrand._id }
        : { ...carBrandForm, logo: logoUrl, cloudinaryPublicId: publicId };

      const response = await fetch("/api/car-brands", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(editingCarBrand ? "✅ Brand updated!" : "✅ Brand added!");
        setShowCarBrandForm(false);
        setEditingCarBrand(null);
        setCarBrandForm({ name: "", logo: "", cloudinaryPublicId: "" });
        setPreview(null);
        await fetchData();
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error(data.error || "Failed to save brand");
      }
    } catch (error) {
      setMessage("❌ Failed to save brand: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCarBrand = async (id) => {
    if (!confirm("Delete this brand?")) return;
    try {
      const response = await fetch(`/api/car-brands?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        setMessage("✅ Brand deleted!");
        await fetchData();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ Failed to delete brand: " + error.message);
    }
  };

  const handleCarModelSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setUploading(true);

    try {
      const fileInput = document.querySelector('input[name="carModelImage"]');
      const file = fileInput?.files[0];

      let imageUrl = carModelForm.image;
      let publicId = carModelForm.cloudinaryPublicId;

      if (file) {
        const signatureRes = await fetch(`/api/upload-signature?folder=automotive-carcare/car-models`);
        const signatureData = await signatureRes.json();

        if (signatureData.error) throw new Error(signatureData.error);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("timestamp", signatureData.timestamp);
        formData.append("signature", signatureData.signature);
        formData.append("api_key", signatureData.apiKey);
        formData.append("folder", signatureData.folder);

        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        const result = await cloudinaryRes.json();
        if (result.error) throw new Error(result.error.message);

        imageUrl = result.secure_url;
        publicId = result.public_id;
      }

      if (!imageUrl || !publicId) {
        throw new Error("Please select an image");
      }

      const method = editingCarModel ? "PUT" : "POST";
      const body = editingCarModel
        ? { ...carModelForm, image: imageUrl, cloudinaryPublicId: publicId, _id: editingCarModel._id }
        : { ...carModelForm, image: imageUrl, cloudinaryPublicId: publicId };

      const response = await fetch("/api/car-models", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(editingCarModel ? "✅ Car model updated!" : "✅ Car model added!");
        setShowCarModelForm(false);
        setEditingCarModel(null);
        setCarModelForm({ brand: "", name: "", image: "", cloudinaryPublicId: "", serviceCount: 6 });
        setPreview(null);
        await fetchData();
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error(data.error || "Failed to save car model");
      }
    } catch (error) {
      setMessage("❌ Failed to save car model: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCarModel = async (id) => {
    if (!confirm("Delete this car model?")) return;
    try {
      const response = await fetch(`/api/car-models?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        setMessage("✅ Car model deleted!");
        await fetchData();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ Failed to delete car model: " + error.message);
    }
  };

  // ── SPECIAL SERVICES ──────────────────────────────────────────────────────
  const handleSpecialServiceSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setUploading(true);

    try {
      const heroFile = document.querySelector('input[name="ssHeroImage"]')?.files[0];
      const contentFile = document.querySelector('input[name="ssContentImage"]')?.files[0];

      let heroUrl = specialServiceForm.heroImage;
      let heroPublicId = specialServiceForm.heroImagePublicId;
      let contentUrl = specialServiceForm.contentImage;
      let contentPublicId = specialServiceForm.contentImagePublicId;

      if (heroFile) {
        const result = await uploadToCloudinary(heroFile, "automotive-carcare/special-services/hero");
        heroUrl = result.url;
        heroPublicId = result.publicId;
      }

      if (contentFile) {
        const result = await uploadToCloudinary(contentFile, "automotive-carcare/special-services/content");
        contentUrl = result.url;
        contentPublicId = result.publicId;
      }

      if (!heroUrl || !contentUrl) {
        throw new Error("Both hero image and content image are required");
      }

      const slug = specialServiceForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const method = editingSpecialService ? "PUT" : "POST";
      const body = {
        ...specialServiceForm,
        heroImage: heroUrl,
        heroImagePublicId: heroPublicId,
        contentImage: contentUrl,
        contentImagePublicId: contentPublicId,
        slug,
        ...(editingSpecialService ? { _id: editingSpecialService._id } : {}),
      };

      const response = await fetch("/api/special-services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(editingSpecialService ? "✅ Special service updated!" : "✅ Special service added!");
        resetSpecialServiceForm();
        await fetchData();
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error(data.error || "Failed to save special service");
      }
    } catch (error) {
      setMessage("❌ " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSpecialService = async (id) => {
    if (!confirm("Delete this special service?")) return;
    try {
      const res = await fetch(`/api/special-services?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Special service deleted!");
        await fetchData();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ Failed to delete: " + error.message);
    }
  };

  const resetSpecialServiceForm = () => {
    setShowSpecialServiceForm(false);
    setEditingSpecialService(null);
    setSpecialServiceForm({
      name: "", tagline: "", description: "", content: "",
      heroImage: "", heroImagePublicId: "", contentImage: "", contentImagePublicId: "", order: 0,
    });
    setPreviewHero(null);
    setPreviewContent(null);
  };
  // ─────────────────────────────────────────────────────────────────────────

  const handleAcceptBooking = async (booking) => {
    if (!confirm(`Accept booking from ${booking.name}?`)) return;

    try {
      setMessage("");
      let bookingId = typeof booking._id === 'object'
        ? (booking._id.$oid || booking._id.toString())
        : booking._id;

      const response = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: bookingId, status: "confirmed" }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("✅ Booking accepted!");
        await fetchData();
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error(data.error || "Failed to accept booking");
      }
    } catch (error) {
      setMessage("❌ Failed to accept booking: " + error.message);
    }
  };

  const handleDeleteBooking = async (booking) => {
    if (!confirm(`Delete booking from ${booking.name}?`)) return;

    try {
      setMessage("");
      const bookingId = typeof booking._id === 'object' ? booking._id.toString() : booking._id;
      const response = await fetch(`/api/bookings?id=${bookingId}`, { method: "DELETE" });
      const data = await response.json();

      if (data.success) {
        setMessage("✅ Booking deleted!");
        await fetchData();
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error(data.error || "Failed to delete booking");
      }
    } catch (error) {
      setMessage("❌ Failed to delete booking: " + error.message);
    }
  };

  const groupBookingsByDate = () => {
    const grouped = {};
    bookings.forEach((booking) => {
      if (!grouped[booking.bookingDate]) grouped[booking.bookingDate] = [];
      grouped[booking.bookingDate].push(booking);
    });
    return grouped;
  };

  const formatServicesDisplay = (booking) => {
    const services = [];
    if (booking.serviceName) services.push(booking.serviceName);
    if (booking.additionalServices && booking.additionalServices.length > 0) {
      booking.additionalServices.forEach(service => services.push(service.name));
    }
    return services;
  };

  if (loading && !["services", "detailed-services", "vehicle-brands", "car-brands", "car-models", "special-services"].includes(activeTab)) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <div className="loading-text">Loading...</div>
        </div>
      </div>
    );
  }

  const SVG = ({ path, className = "icon-md" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );

  const tabs = [
    { id: "bookings", label: "Bookings", count: bookings.length },
    { id: "services", label: "Services", count: services.length },
    { id: "detailed-services", label: "General Services", count: detailedServices.length },
    { id: "special-services", label: "Special Services", count: specialServices.length },
    { id: "vehicle-brands", label: "Vehicle Brands", count: vehicleBrands.length },
    { id: "car-brands", label: "Car Brands", count: carBrands.length },
    { id: "car-models", label: "Car Models", count: carModels.length },
    { id: "hero-images", label: "Hero Images", count: heroImages.length },
  ];

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">Admin Dashboard</h1>
          <button type="button" onClick={handleLogout} className="logout-btn">
            <SVG path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="nav-tabs">
        <div className="nav-tabs-content">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <main className="main-content">
        {message && (
          <div className={`message-box ${message.includes("✅") || message.includes("success") ? "success" : "error"}`}>
            <SVG
              path={message.includes("✅") || message.includes("success")
                ? "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                : "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"}
              className="message-icon"
            />
            <span>{message}</span>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">Bookings</h2>
                <p className="section-subtitle">Manage customer bookings</p>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="empty-state">
                <SVG path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" className="empty-icon" />
                <p className="empty-text">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupBookingsByDate())
                  .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                  .map(([date, dateBookings]) => (
                    <div key={date} className="date-group">
                      <div className="date-header">
                        <SVG path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" className="date-icon" />
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        <span className="date-count">{dateBookings.length} booking{dateBookings.length > 1 ? "s" : ""}</span>
                      </div>
                      <div className="space-y-4">
                        {dateBookings.map((booking) => {
                          const bookingServices = formatServicesDisplay(booking);
                          return (
                            <div key={booking._id} className="booking-card">
                              <div className="booking-grid">
                                <div>
                                  <p className="booking-label">Customer</p>
                                  <p className="booking-value">{booking.name}</p>
                                  <p className="text-gray text-sm mt-2">{booking.email}</p>
                                  <p className="text-gray text-sm">{booking.phone}</p>
                                </div>
                                <div>
                                  <p className="booking-label">Service Details</p>
                                  {bookingServices.length > 0 ? (
                                    <div className="mb-2">
                                      {bookingServices.length === 1 ? (
                                        <p className="booking-value">{bookingServices[0]}</p>
                                      ) : (
                                        <>
                                          <p className="text-sm font-semibold mb-1" style={{color: 'rgb(147, 197, 253)'}}>
                                            {bookingServices.length} Services Selected
                                          </p>
                                          <div className="badge-grid">
                                            {bookingServices.map((service, idx) => (
                                              <span key={idx} className="badge" style={{fontSize: '0.75rem', padding: '0.25rem 0.5rem'}}>
                                                {service}
                                              </span>
                                            ))}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="booking-value text-gray">No service selected</p>
                                  )}
                                  <p className="text-sm text-gray mt-2">Vehicle: {booking.vehicleBrand} {booking.vehicleModel}</p>
                                  <p className="text-sm text-gray">Time: {booking.bookingTime}</p>
                                </div>
                                <div>
                                  <p className="booking-label">Status</p>
                                  <span className={`status-badge ${booking.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}`}>
                                    {booking.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                                  </span>
                                  <div className="space-y-2 mt-4">
                                    {booking.status === 'pending' && (
                                      <button type="button" onClick={() => handleAcceptBooking(booking)} className="btn-accept">
                                        <SVG path="M5 13l4 4L19 7" className="icon-sm" />
                                        Accept
                                      </button>
                                    )}
                                    <button type="button" onClick={() => handleDeleteBooking(booking)} className="btn-delete" style={{width: '100%'}}>
                                      <SVG path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="icon-sm" />
                                      Delete
                                    </button>
                                  </div>
                                  {booking.notes && (
                                    <div className="mt-3 p-2" style={{background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.375rem', borderLeft: '3px solid rgb(59, 130, 246)'}}>
                                      <p className="text-xs text-gray mb-1">📝 Notes:</p>
                                      <p className="text-sm text-gray">{booking.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* SERVICES TAB — EXISTING, UNTOUCHED */}
        {activeTab === "services" && (
          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">Services</h2>
                <p className="section-subtitle">Manage car care services with images</p>
              </div>
              <button onClick={() => {
                setShowServiceForm(true);
                setEditingService(null);
                setServiceForm({ name: "", description: "", features: "", order: services.length, image: "", cloudinaryPublicId: "" });
                setPreview(null);
              }} className="btn-primary">
                <SVG path="M12 4v16m8-8H4" className="icon-sm" />
                Add Service
              </button>
            </div>

            {showServiceForm && (
              <div className="form-card">
                <h3 className="form-title">{editingService ? "Edit Service" : "Add Service"}</h3>
                <form onSubmit={handleServiceSubmit}>
                  <div className="form-group">
                    <label className="form-label">Service Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm({ ...serviceForm, [e.target.name]: e.target.value })}
                      required
                      placeholder="Premium Car Wash"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea
                      name="description"
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({ ...serviceForm, [e.target.name]: e.target.value })}
                      required
                      rows={3}
                      placeholder="Brief description"
                      className="form-textarea"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Features (comma-separated)</label>
                    <textarea
                      name="features"
                      value={serviceForm.features}
                      onChange={(e) => setServiceForm({ ...serviceForm, [e.target.name]: e.target.value })}
                      rows={2}
                      placeholder="Exterior wash, Interior vacuum"
                      className="form-textarea"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Service Image * {editingService && "(Upload new to replace)"}</label>
                    <input
                      type="file"
                      name="serviceImage"
                      accept="image/*"
                      onChange={handleServiceImageChange}
                      className="form-input"
                      style={{padding: '0.5rem'}}
                      required={!editingService}
                    />
                    <p className="text-xs text-gray mt-1">💡 Recommended: Square images (500x500px or larger)</p>
                    {preview && (
                      <img src={preview} alt="Preview" style={{width: '10rem', height: '10rem', objectFit: 'cover', borderRadius: '0.5rem', marginTop: '1rem'}} />
                    )}
                    {editingService && !preview && serviceForm.image && (
                      <img src={serviceForm.image} alt="Current" style={{width: '10rem', height: '10rem', objectFit: 'cover', borderRadius: '0.5rem', marginTop: '1rem'}} />
                    )}
                  </div>
                  <div className="form-actions">
                    <button type="submit" disabled={uploading} className="btn-primary" style={{flex: 1}}>
                      {uploading ? "Saving..." : (editingService ? "Update" : "Add")}
                    </button>
                    <button type="button" onClick={() => {
                      setShowServiceForm(false);
                      setEditingService(null);
                      setPreview(null);
                    }} className="btn-cancel">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {services.length === 0 ? (
              <div className="empty-state">
                <SVG path="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" className="empty-icon" />
                <p className="empty-text">No services added</p>
              </div>
            ) : (
              <div className="card-grid">
                {services.map((service) => (
                  <div key={service._id} className="card">
                    {service.image && (
                      <img src={service.image} alt={service.name} style={{width: '100%', height: '12rem', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem'}} />
                    )}
                    <div className="card-header">
                      <h3 className="card-title">{service.name}</h3>
                    </div>
                    <p className="card-subtitle">Slug: {service.slug}</p>
                    <p className="text-gray text-sm mb-4">{service.description}</p>
                    {service.features && (
                      <div className="mb-4">
                        <p className="text-xs text-gray mb-2">Features:</p>
                        <div className="badge-grid">
                          {service.features.split(',').map((feature, idx) => (
                            <span key={idx} className="badge" style={{backgroundColor: 'rgb(63, 63, 70)'}}>{feature.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="card-actions">
                      <button type="button" onClick={() => {
                        setEditingService(service);
                        setServiceForm(service);
                        setShowServiceForm(true);
                        setPreview(null);
                      }} className="btn-edit">Edit</button>
                      <button type="button" onClick={() => handleDeleteService(service._id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SERVICES (DETAILED) TAB — NEW ────────────────────────────────── */}
        {activeTab === "detailed-services" && (
          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">⚙️ General Services</h2>
                <p className="section-subtitle">
                  Manage services with hero image, content image, tagline &amp; full details — used on the Services page
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDetailedServiceForm(true);
                  setEditingDetailedService(null);
                  setDetailedServiceForm({
                    name: "", tagline: "", description: "", content: "", features: "",
                    order: detailedServices.length,
                    image: "", cloudinaryPublicId: "", contentImage: "", contentImagePublicId: "",
                  });
                  setDetailedPreviewHero(null);
                  setDetailedPreviewContent(null);
                }}
                className="btn-primary"
              >
                <SVG path="M12 4v16m8-8H4" className="icon-sm" />
                Add Service
              </button>
            </div>

            {showDetailedServiceForm && (
              <div className="form-card">
                <h3 className="form-title">
                  {editingDetailedService ? "Edit Service" : "Add Service"}
                </h3>
                <form onSubmit={handleDetailedServiceSubmit}>

                  <div className="form-group">
                    <label className="form-label">Service Name *</label>
                    <input
                      type="text"
                      value={detailedServiceForm.name}
                      onChange={(e) => setDetailedServiceForm({ ...detailedServiceForm, name: e.target.value })}
                      required
                      placeholder="e.g., Mechanical Works"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tagline *</label>
                    <input
                      type="text"
                      value={detailedServiceForm.tagline}
                      onChange={(e) => setDetailedServiceForm({ ...detailedServiceForm, tagline: e.target.value })}
                      required
                      placeholder="e.g., Precision. Power. Performance."
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Short Description *</label>
                    <textarea
                      value={detailedServiceForm.description}
                      onChange={(e) => setDetailedServiceForm({ ...detailedServiceForm, description: e.target.value })}
                      required
                      rows={2}
                      placeholder="Brief description shown in the hero section when this service is active"
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Full Content / Details *</label>
                    <textarea
                      value={detailedServiceForm.content}
                      onChange={(e) => setDetailedServiceForm({ ...detailedServiceForm, content: e.target.value })}
                      required
                      rows={5}
                      placeholder="Full service description shown in the right panel when selected"
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Features (comma-separated)</label>
                    <textarea
                      value={detailedServiceForm.features}
                      onChange={(e) => setDetailedServiceForm({ ...detailedServiceForm, features: e.target.value })}
                      rows={2}
                      placeholder="Feature 1, Feature 2, Feature 3"
                      className="form-textarea"
                    />
                  </div>

                  {/* HERO IMAGE */}
                  <div className="form-group">
                    <label className="form-label">
                      Hero Image (full-screen background) *{editingDetailedService && " — upload new to replace"}
                    </label>
                    <input
                      type="file"
                      name="dsHeroImage"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) setDetailedPreviewHero(URL.createObjectURL(file));
                      }}
                      className="form-input"
                      style={{ padding: "0.5rem" }}
                      required={!editingDetailedService}
                    />
                    <p className="text-xs text-gray mt-1">💡 Wide landscape recommended (1920×1080px)</p>
                    {detailedPreviewHero && (
                      <img src={detailedPreviewHero} alt="Hero Preview"
                        style={{ width: "100%", maxWidth: "24rem", height: "auto", borderRadius: "0.5rem", marginTop: "1rem" }} />
                    )}
                    {editingDetailedService && !detailedPreviewHero && detailedServiceForm.image && (
                      <div style={{ marginTop: "0.75rem" }}>
                        <p className="text-xs text-gray mb-1">Current hero image:</p>
                        <img src={detailedServiceForm.image} alt="Current Hero"
                          style={{ width: "100%", maxWidth: "24rem", height: "auto", borderRadius: "0.5rem" }} />
                      </div>
                    )}
                  </div>

                  {/* CONTENT IMAGE */}
                  <div className="form-group">
                    <label className="form-label">
                      Content Image (shown in right panel) *{editingDetailedService && " — upload new to replace"}
                    </label>
                    <input
                      type="file"
                      name="dsContentImage"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) setDetailedPreviewContent(URL.createObjectURL(file));
                      }}
                      className="form-input"
                      style={{ padding: "0.5rem" }}
                      required={!editingDetailedService}
                    />
                    <p className="text-xs text-gray mt-1">💡 Square or portrait recommended (500×700px)</p>
                    {detailedPreviewContent && (
                      <img src={detailedPreviewContent} alt="Content Preview"
                        style={{ width: "100%", maxWidth: "16rem", height: "auto", borderRadius: "0.5rem", marginTop: "1rem" }} />
                    )}
                    {editingDetailedService && !detailedPreviewContent && detailedServiceForm.contentImage && (
                      <div style={{ marginTop: "0.75rem" }}>
                        <p className="text-xs text-gray mb-1">Current content image:</p>
                        <img src={detailedServiceForm.contentImage} alt="Current Content"
                          style={{ width: "100%", maxWidth: "16rem", height: "auto", borderRadius: "0.5rem" }} />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Display Order</label>
                    <input
                      type="number"
                      value={detailedServiceForm.order}
                      onChange={(e) => setDetailedServiceForm({ ...detailedServiceForm, order: parseInt(e.target.value) })}
                      min="0"
                      className="form-input"
                    />
                    <p className="text-xs text-gray mt-1">Controls position in the left sidebar menu (0 = first)</p>
                  </div>

                  <div className="form-actions">
                    <button type="submit" disabled={uploading} className="btn-primary" style={{ flex: 1 }}>
                      {uploading ? "Saving..." : editingDetailedService ? "Update Service" : "Add Service"}
                    </button>
                    <button type="button" onClick={resetDetailedServiceForm} className="btn-cancel">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {detailedServices.length === 0 ? (
              <div className="empty-state">
                <SVG path="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" className="empty-icon" />
                <p className="empty-text">No detailed services added yet</p>
                <p className="text-sm text-gray mt-2">Click "Add Service" to get started</p>
              </div>
            ) : (
              <div className="card-grid">
                {[...detailedServices].sort((a, b) => a.order - b.order).map((service) => (
                  <div key={service._id} className="card">
                    {service.image && (
                      <img src={service.image} alt={service.name}
                        style={{ width: "100%", height: "12rem", objectFit: "cover", borderRadius: "0.5rem", marginBottom: "1rem" }} />
                    )}
                    <div className="card-header">
                      <h3 className="card-title">{service.name}</h3>
                    </div>
                    <p className="card-subtitle" style={{ color: "rgb(134,239,172)", fontStyle: "italic" }}>
                      "{service.tagline}"
                    </p>
                    <p className="text-gray text-sm mb-2">📌 Slug: {service.slug}</p>
                    <p className="text-gray text-sm mb-3" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {service.description}
                    </p>
                    {service.contentImage && (
                      <div className="mb-3 p-3" style={{ background: "rgba(59,130,246,0.1)", borderRadius: "0.5rem" }}>
                        <p className="text-xs mb-2" style={{ color: "rgb(147,197,253)" }}>✓ Content Image</p>
                        <img src={service.contentImage} alt="Content"
                          style={{ width: "100%", height: "7rem", objectFit: "cover", borderRadius: "0.375rem" }} />
                      </div>
                    )}
                    {service.content && (
                      <div className="mb-3 p-3" style={{ background: "rgba(34,197,94,0.1)", borderRadius: "0.5rem" }}>
                        <p className="text-xs mb-1" style={{ color: "rgb(134,239,172)" }}>📝 Has Content</p>
                        <p className="text-xs" style={{ color: "rgb(134,239,172)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {service.content}
                        </p>
                      </div>
                    )}
                    {service.features && (
                      <div className="mb-3">
                        <p className="text-xs text-gray mb-2">Features:</p>
                        <div className="badge-grid">
                          {service.features.split(",").slice(0, 3).map((f, idx) => (
                            <span key={idx} className="badge" style={{ backgroundColor: "rgb(63,63,70)" }}>{f.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray mb-4">Order: #{service.order}</p>
                    <div className="card-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDetailedService(service);
                          setDetailedServiceForm(service);
                          setShowDetailedServiceForm(true);
                          setDetailedPreviewHero(null);
                          setDetailedPreviewContent(null);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="btn-edit"
                      >Edit</button>
                      <button type="button" onClick={() => handleDeleteDetailedService(service._id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* ─────────────────────────────────────────────────────────────────── */}

        {/* ── SPECIAL SERVICES TAB ─────────────────────────────────────────── */}
        {activeTab === "special-services" && (
          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">⭐ Special Services</h2>
                <p className="section-subtitle">
                  Manage special services — hero image, content image, tagline &amp; details
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSpecialServiceForm(true);
                  setEditingSpecialService(null);
                  setSpecialServiceForm({
                    name: "", tagline: "", description: "", content: "",
                    heroImage: "", heroImagePublicId: "",
                    contentImage: "", contentImagePublicId: "",
                    order: specialServices.length,
                  });
                  setPreviewHero(null);
                  setPreviewContent(null);
                }}
                className="btn-primary"
              >
                <SVG path="M12 4v16m8-8H4" className="icon-sm" />
                Add Special Service
              </button>
            </div>

            {showSpecialServiceForm && (
              <div className="form-card">
                <h3 className="form-title">
                  {editingSpecialService ? "Edit Special Service" : "Add Special Service"}
                </h3>
                <form onSubmit={handleSpecialServiceSubmit}>
                  <div className="form-group">
                    <label className="form-label">Service Name *</label>
                    <input type="text" value={specialServiceForm.name}
                      onChange={(e) => setSpecialServiceForm({ ...specialServiceForm, name: e.target.value })}
                      required placeholder="e.g., Automatic Gear Box Repairing" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tagline *</label>
                    <input type="text" value={specialServiceForm.tagline}
                      onChange={(e) => setSpecialServiceForm({ ...specialServiceForm, tagline: e.target.value })}
                      required placeholder="e.g., Smooth Shifting. Zero Compromise." className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Short Description *</label>
                    <textarea value={specialServiceForm.description}
                      onChange={(e) => setSpecialServiceForm({ ...specialServiceForm, description: e.target.value })}
                      required rows={2} placeholder="Brief description shown in the hero when this service is active" className="form-textarea" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Content / Details *</label>
                    <textarea value={specialServiceForm.content}
                      onChange={(e) => setSpecialServiceForm({ ...specialServiceForm, content: e.target.value })}
                      required rows={5} placeholder="Full service description shown in the right panel when selected" className="form-textarea" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hero Image (full-screen background) *{editingSpecialService && " — upload new to replace"}</label>
                    <input type="file" name="ssHeroImage" accept="image/*"
                      onChange={(e) => { const f = e.target.files[0]; if (f) setPreviewHero(URL.createObjectURL(f)); }}
                      className="form-input" style={{ padding: "0.5rem" }} required={!editingSpecialService} />
                    <p className="text-xs text-gray mt-1">💡 Wide landscape recommended (1920×1080px)</p>
                    {previewHero && (
                      <img src={previewHero} alt="Hero Preview"
                        style={{ width: "100%", maxWidth: "24rem", height: "auto", borderRadius: "0.5rem", marginTop: "1rem" }} />
                    )}
                    {editingSpecialService && !previewHero && specialServiceForm.heroImage && (
                      <div style={{ marginTop: "0.75rem" }}>
                        <p className="text-xs text-gray mb-1">Current hero image:</p>
                        <img src={specialServiceForm.heroImage} alt="Current Hero"
                          style={{ width: "100%", maxWidth: "24rem", height: "auto", borderRadius: "0.5rem" }} />
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Content Image (shown in right panel) *{editingSpecialService && " — upload new to replace"}</label>
                    <input type="file" name="ssContentImage" accept="image/*"
                      onChange={(e) => { const f = e.target.files[0]; if (f) setPreviewContent(URL.createObjectURL(f)); }}
                      className="form-input" style={{ padding: "0.5rem" }} required={!editingSpecialService} />
                    <p className="text-xs text-gray mt-1">💡 Square or portrait recommended (500×700px)</p>
                    {previewContent && (
                      <img src={previewContent} alt="Content Preview"
                        style={{ width: "100%", maxWidth: "16rem", height: "auto", borderRadius: "0.5rem", marginTop: "1rem" }} />
                    )}
                    {editingSpecialService && !previewContent && specialServiceForm.contentImage && (
                      <div style={{ marginTop: "0.75rem" }}>
                        <p className="text-xs text-gray mb-1">Current content image:</p>
                        <img src={specialServiceForm.contentImage} alt="Current Content"
                          style={{ width: "100%", maxWidth: "16rem", height: "auto", borderRadius: "0.5rem" }} />
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Display Order</label>
                    <input type="number" value={specialServiceForm.order}
                      onChange={(e) => setSpecialServiceForm({ ...specialServiceForm, order: parseInt(e.target.value) })}
                      min="0" className="form-input" />
                    <p className="text-xs text-gray mt-1">Controls position in the left sidebar menu (0 = first)</p>
                  </div>
                  <div className="form-actions">
                    <button type="submit" disabled={uploading} className="btn-primary" style={{ flex: 1 }}>
                      {uploading ? "Saving..." : editingSpecialService ? "Update Special Service" : "Add Special Service"}
                    </button>
                    <button type="button" onClick={resetSpecialServiceForm} className="btn-cancel">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {specialServices.length === 0 ? (
              <div className="empty-state">
                <SVG path="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" className="empty-icon" />
                <p className="empty-text">No special services added yet</p>
                <p className="text-sm text-gray mt-2">Click "Add Special Service" to get started</p>
              </div>
            ) : (
              <div className="card-grid">
                {[...specialServices].sort((a, b) => a.order - b.order).map((service) => (
                  <div key={service._id} className="card">
                    {service.heroImage && (
                      <img src={service.heroImage} alt={service.name}
                        style={{ width: "100%", height: "12rem", objectFit: "cover", borderRadius: "0.5rem", marginBottom: "1rem" }} />
                    )}
                    <div className="card-header"><h3 className="card-title">{service.name}</h3></div>
                    <p className="card-subtitle" style={{ color: "rgb(252,165,165)", fontStyle: "italic" }}>"{service.tagline}"</p>
                    <p className="text-gray text-sm mb-2">📌 Slug: {service.slug}</p>
                    <p className="text-gray text-sm mb-3" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{service.description}</p>
                    {service.contentImage && (
                      <div className="mb-3 p-3" style={{ background: "rgba(59,130,246,0.1)", borderRadius: "0.5rem" }}>
                        <p className="text-xs mb-2" style={{ color: "rgb(147,197,253)" }}>✓ Content Image</p>
                        <img src={service.contentImage} alt="Content" style={{ width: "100%", height: "7rem", objectFit: "cover", borderRadius: "0.375rem" }} />
                      </div>
                    )}
                    {service.content && (
                      <div className="mb-3 p-3" style={{ background: "rgba(34,197,94,0.1)", borderRadius: "0.5rem" }}>
                        <p className="text-xs mb-1" style={{ color: "rgb(134,239,172)" }}>📝 Has Content</p>
                        <p className="text-xs" style={{ color: "rgb(134,239,172)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{service.content}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray mb-4">Order: #{service.order}</p>
                    <div className="card-actions">
                      <button type="button" onClick={() => {
                        setEditingSpecialService(service);
                        setSpecialServiceForm(service);
                        setShowSpecialServiceForm(true);
                        setPreviewHero(null);
                        setPreviewContent(null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }} className="btn-edit">Edit</button>
                      <button type="button" onClick={() => handleDeleteSpecialService(service._id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* ─────────────────────────────────────────────────────────────────── */}

        {/* VEHICLE BRANDS TAB */}
        {activeTab === "vehicle-brands" && (
          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">Vehicle Brands & Models</h2>
                <p className="section-subtitle">Manage brands and models for booking form</p>
              </div>
              <button onClick={() => { setShowBrandForm(true); setEditingBrand(null); setBrandForm({ name: "", models: "" }); }} className="btn-primary">
                <SVG path="M12 4v16m8-8H4" className="icon-sm" />
                Add Brand
              </button>
            </div>
            {showBrandForm && (
              <div className="form-card">
                <h3 className="form-title">{editingBrand ? "Edit Brand" : "Add Brand"}</h3>
                <form onSubmit={handleBrandSubmit}>
                  <div className="form-group">
                    <label className="form-label">Brand Name * <span className="text-xs text-gray">(e.g., Mahindra)</span></label>
                    <input type="text" name="name" value={brandForm.name}
                      onChange={(e) => setBrandForm({ ...brandForm, [e.target.name]: e.target.value })}
                      required placeholder="Mahindra" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Models * <span className="text-xs text-gray">(comma-separated)</span></label>
                    <textarea name="models" value={brandForm.models}
                      onChange={(e) => setBrandForm({ ...brandForm, [e.target.name]: e.target.value })}
                      required rows={3} placeholder="Thar, Scorpio, XUV700" className="form-textarea" />
                    <p className="text-xs text-gray mt-2">💡 Separate models with commas</p>
                  </div>
                  <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-primary" style={{flex: 1}}>
                      {loading ? "Saving..." : (editingBrand ? "Update" : "Add")}
                    </button>
                    <button type="button" onClick={() => { setShowBrandForm(false); setEditingBrand(null); }} className="btn-cancel">Cancel</button>
                  </div>
                </form>
              </div>
            )}
            {vehicleBrands.length === 0 ? (
              <div className="empty-state">
                <SVG path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" className="empty-icon" />
                <p className="empty-text">No brands added</p>
              </div>
            ) : (
              <div className="card-grid">
                {vehicleBrands.map((brand) => (
                  <div key={brand._id} className="card">
                    <h3 className="card-title"><span className="card-icon">🏢</span>{brand.name}</h3>
                    <p className="card-subtitle">Slug: {brand.slug}</p>
                    <div className="mb-4">
                      <p className="text-xs text-gray mb-2">Models ({brand.models?.length || 0}):</p>
                      {!brand.models || brand.models.length === 0 ? (
                        <p className="text-xs" style={{color: 'rgb(248, 113, 113)'}}>⚠️ No models</p>
                      ) : (
                        <div className="badge-grid">
                          {brand.models.map((model, idx) => (<span key={idx} className="badge">{model}</span>))}
                        </div>
                      )}
                    </div>
                    <div className="card-actions">
                      <button onClick={() => { setEditingBrand(brand); setBrandForm({ name: brand.name, models: brand.models.join(", ") }); setShowBrandForm(true); }} className="btn-edit">Edit</button>
                      <button onClick={() => handleDeleteBrand(brand._id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CAR BRANDS TAB */}
        {activeTab === "car-brands" && (
          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">🏢 Car Brands</h2>
                <p className="section-subtitle">Manage car brands with logos for brand pages</p>
              </div>
              <button onClick={() => { setShowCarBrandForm(true); setEditingCarBrand(null); setCarBrandForm({ name: "", logo: "", cloudinaryPublicId: "" }); setPreview(null); }} className="btn-primary">
                <SVG path="M12 4v16m8-8H4" className="icon-sm" />
                Add Brand
              </button>
            </div>
            {showCarBrandForm && (
              <div className="form-card">
                <h3 className="form-title">{editingCarBrand ? "Edit Brand" : "Add Brand"}</h3>
                <form onSubmit={handleCarBrandSubmit}>
                  <div className="form-group">
                    <label className="form-label">Brand Name *</label>
                    <input type="text" name="name" value={carBrandForm.name}
                      onChange={(e) => setCarBrandForm({ ...carBrandForm, [e.target.name]: e.target.value })}
                      required placeholder="Toyota" className="form-input" />
                    <p className="text-xs text-gray mt-1">💡 Enter exact brand name (e.g., "Toyota", "Mahindra")</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brand Logo * {editingCarBrand && "(Upload new to replace)"}</label>
                    <input type="file" name="carBrandLogo" accept="image/*" onChange={handleCarBrandLogoChange}
                      className="form-input" style={{padding: '0.5rem'}} required={!editingCarBrand} />
                    {preview && <img src={preview} alt="Preview" style={{width: '10rem', height: '10rem', objectFit: 'contain', borderRadius: '0.5rem', marginTop: '1rem', background: '#f3f4f6'}} />}
                    {editingCarBrand && !preview && carBrandForm.logo && <img src={carBrandForm.logo} alt="Current" style={{width: '10rem', height: '10rem', objectFit: 'contain', borderRadius: '0.5rem', marginTop: '1rem', background: '#f3f4f6'}} />}
                  </div>
                  <div className="form-actions">
                    <button type="submit" disabled={uploading} className="btn-primary" style={{flex: 1}}>
                      {uploading ? "Saving..." : (editingCarBrand ? "Update Brand" : "Add Brand")}
                    </button>
                    <button type="button" onClick={() => { setShowCarBrandForm(false); setEditingCarBrand(null); setPreview(null); }} className="btn-cancel">Cancel</button>
                  </div>
                </form>
              </div>
            )}
            {carBrands.length === 0 ? (
              <div className="empty-state">
                <SVG path="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" className="empty-icon" />
                <p className="empty-text">No car brands added yet</p>
              </div>
            ) : (
              <div className="card-grid">
                {carBrands.map((brand) => (
                  <div key={brand._id} className="card">
                    <img src={brand.logo} alt={brand.name} style={{width: '100%', height: '10rem', objectFit: 'contain', borderRadius: '0.5rem', marginBottom: '1rem', background: '#f3f4f6'}} />
                    <div className="card-header"><h3 className="card-title">{brand.name}</h3></div>
                    <p className="text-sm text-gray mb-4">Slug: {brand.brandSlug}</p>
                    <div className="card-actions">
                      <button onClick={() => { setEditingCarBrand(brand); setCarBrandForm(brand); setShowCarBrandForm(true); setPreview(null); }} className="btn-edit">Edit</button>
                      <button onClick={() => handleDeleteCarBrand(brand._id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CAR MODELS TAB */}
        {activeTab === "car-models" && (
          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">🚗 Car Models</h2>
                <p className="section-subtitle">Manage car models with images for brand pages</p>
              </div>
              <button onClick={() => { setShowCarModelForm(true); setEditingCarModel(null); setCarModelForm({ brand: "", name: "", image: "", cloudinaryPublicId: "", serviceCount: 6 }); setPreview(null); }} className="btn-primary">
                <SVG path="M12 4v16m8-8H4" className="icon-sm" />
                Add Car Model
              </button>
            </div>
            {showCarModelForm && (
              <div className="form-card">
                <h3 className="form-title">{editingCarModel ? "Edit Car Model" : "Add Car Model"}</h3>
                <form onSubmit={handleCarModelSubmit}>
                  <div className="form-group">
                    <label className="form-label">Brand Name *</label>
                    <input type="text" name="brand" value={carModelForm.brand}
                      onChange={(e) => setCarModelForm({ ...carModelForm, [e.target.name]: e.target.value })}
                      required placeholder="Toyota" className="form-input" />
                    <p className="text-xs text-gray mt-1">💡 Must match brand name exactly</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model Name *</label>
                    <input type="text" name="name" value={carModelForm.name}
                      onChange={(e) => setCarModelForm({ ...carModelForm, [e.target.name]: e.target.value })}
                      required placeholder="Fortuner" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Service Count</label>
                    <input type="number" name="serviceCount" value={carModelForm.serviceCount}
                      onChange={(e) => setCarModelForm({ ...carModelForm, [e.target.name]: parseInt(e.target.value) })}
                      min="1" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model Image * {editingCarModel && "(Upload new to replace)"}</label>
                    <input type="file" name="carModelImage" accept="image/*" onChange={handleCarModelImageChange}
                      className="form-input" style={{padding: '0.5rem'}} required={!editingCarModel} />
                    {preview && <img src={preview} alt="Preview" style={{width: '16rem', height: '10rem', objectFit: 'contain', borderRadius: '0.5rem', marginTop: '1rem', background: '#f3f4f6'}} />}
                    {editingCarModel && !preview && carModelForm.image && <img src={carModelForm.image} alt="Current" style={{width: '16rem', height: '10rem', objectFit: 'contain', borderRadius: '0.5rem', marginTop: '1rem', background: '#f3f4f6'}} />}
                  </div>
                  <div className="form-actions">
                    <button type="submit" disabled={uploading} className="btn-primary" style={{flex: 1}}>
                      {uploading ? "Saving..." : (editingCarModel ? "Update Model" : "Add Model")}
                    </button>
                    <button type="button" onClick={() => { setShowCarModelForm(false); setEditingCarModel(null); setPreview(null); }} className="btn-cancel">Cancel</button>
                  </div>
                </form>
              </div>
            )}
            {carModels.length === 0 ? (
              <div className="empty-state">
                <SVG path="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" className="empty-icon" />
                <p className="empty-text">No car models added yet</p>
              </div>
            ) : (
              <div className="card-grid">
                {carModels.map((model) => (
                  <div key={model._id} className="card">
                    <img src={model.image} alt={model.name} style={{width: '100%', height: '10rem', objectFit: 'contain', borderRadius: '0.5rem', marginBottom: '1rem', background: '#f3f4f6'}} />
                    <div className="card-header"><h3 className="card-title">{model.name}</h3></div>
                    <p className="card-subtitle">🏢 {model.brand}</p>
                    <p className="text-sm text-gray mb-2">Slug: {model.slug}</p>
                    <p className="text-sm text-gray mb-4">📋 {model.serviceCount} Services</p>
                    <div className="card-actions">
                      <button onClick={() => { setEditingCarModel(model); setCarModelForm(model); setShowCarModelForm(true); setPreview(null); }} className="btn-edit">Edit</button>
                      <button onClick={() => handleDeleteCarModel(model._id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HERO IMAGES TAB */}
        {activeTab === "hero-images" && (
          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">Hero Images</h2>
                <p className="section-subtitle">Manage homepage hero carousel images</p>
              </div>
            </div>
            <div className="form-card">
              <h3 className="form-title">Upload New Hero Image</h3>
              <form onSubmit={handleImageUpload}>
                <div className="form-group">
                  <label className="form-label">Select Image *</label>
                  <input type="file" name="file" accept="image/*" onChange={handleFileChange}
                    required className="form-input" style={{padding: '0.5rem'}} />
                  {preview && <img src={preview} alt="Preview" style={{width: '100%', maxWidth: '20rem', height: 'auto', borderRadius: '0.5rem', marginTop: '1rem'}} />}
                </div>
                <button type="submit" disabled={uploading} className="btn-primary" style={{width: '100%'}}>
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              </form>
            </div>
            {heroImages.length === 0 ? (
              <div className="empty-state">
                <SVG path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" className="empty-icon" />
                <p className="empty-text">No hero images uploaded</p>
              </div>
            ) : (
              <div className="card-grid">
                {heroImages.map((image) => (
                  <div key={image.public_id} className="card">
                    <img src={image.secure_url} alt="Hero" style={{width: '100%', height: '12rem', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem'}} />
                    <p className="text-xs text-gray mb-2 truncate">ID: {image.public_id}</p>
                    <p className="text-xs text-gray mb-4">Size: {(image.bytes / 1024).toFixed(2)} KB</p>
                    <button onClick={() => handleDeleteImage(image.public_id)} className="btn-delete" style={{width: '100%'}}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}