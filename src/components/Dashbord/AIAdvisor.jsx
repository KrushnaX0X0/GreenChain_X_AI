
import React, { useState } from "react";
import axios from "axios";
import { Upload, X, Loader2, Sparkles, Sprout, AlertCircle, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const AIAdvisor = () => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  const analyzeCrop = async () => {
    if (!imageFile) return;
    setAnalyzing(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      // Real Backend Call
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/analyze`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Add Authorization header if your backend requires it (e.g., Bearer token)
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      setResult(res.data);
    } catch (error) {
      console.error("AI Analysis Failed:", error);
      if (error.response) {
        console.error("Server Response Data:", JSON.stringify(error.response.data, null, 2));
        alert(`Server Error (${error.response.status}): ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Network Error: No response received from server.");
      } else {
        console.error("Error setting up request:", error.message);
        alert(`Request Error: ${error.message}`);
      }

      const errorMessage = error.response?.data?.message || "Analysis Error";

      setResult({
        healthScore: 0,
        disease: errorMessage,
        confidence: "0%",
        recommendations: ["Ensure backend is running", "Check API Key", "Try again later"],
        status: "Error"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  useGSAP(() => {
    if (result) {
      gsap.from(".result-card", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }
  }, [result]);

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-emerald-950 tracking-tighter flex items-center gap-3">
            <Sparkles className="text-emerald-500" size={32} />
            AI Crop Diagnostic
          </h2>
          <p className="text-emerald-900/60 font-medium mt-2 max-w-xl">
            Upload clear images of your crops to detect diseases, pests, and nutrient deficiencies instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

        {/* Left Column: Upload Area */}
        <div className="flex flex-col gap-6">
          <div
            className={`flex-1 border-2 border-dashed rounded-[32px] transition-all duration-300 relative overflow-hidden group
              ${previewUrl ? 'border-emerald-200 bg-emerald-50/30' : 'border-emerald-100 bg-white hover:border-emerald-400 hover:bg-emerald-50'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                <img
                  src={previewUrl}
                  alt="Crop Preview"
                  className="max-h-[400px] w-full object-contain rounded-2xl shadow-xl shadow-emerald-900/10"
                />

                {/* Analyze Overlay */}
                {analyzing && (
                  <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-sm flex flex-col items-center justify-center rounded-[32px] z-10">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" size={32} />
                    </div>
                    <p className="text-white font-black uppercase tracking-[0.3em] mt-6 animate-pulse">Analyzing Cell Structure...</p>
                  </div>
                )}

                <button
                  onClick={clearImage}
                  className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur text-emerald-950 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-10 text-center">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Upload size={40} />
                </div>
                <span className="text-2xl font-black text-emerald-950 tracking-tight mb-2">Click to Upload or Drag File</span>
                <span className="text-emerald-900/40 font-medium uppercase tracking-widest text-xs">Supports JPG, PNG (Max 10MB)</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <button
            onClick={analyzeCrop}
            disabled={!imageFile || analyzing}
            className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-xl
              ${!imageFile || analyzing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-950 text-white hover:bg-emerald-600 hover:shadow-emerald-200 hover:-translate-y-1'}`}
          >
            {analyzing ? 'Processing...' : 'Run Analysis'}
          </button>
        </div>

        {/* Right Column: Results */}
        <div className="bg-white rounded-[40px] border border-emerald-50 shadow-sm p-8 lg:p-10 flex flex-col h-full overflow-hidden relative">
          {!result ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
              <Sprout size={80} className="text-emerald-200 mb-6" />
              <h3 className="text-2xl font-black text-emerald-950/50">Awaiting Input</h3>
              <p className="text-emerald-900/40 text-sm mt-2 font-medium">Results will appear here after analysis.</p>
            </div>
          ) : (
            <div className="space-y-8 h-full flex flex-col">

              {/* Status Header */}
              <div className="result-card flex items-center justify-between pb-6 border-b border-emerald-50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Alert</span>
                  </div>
                  <h3 className="text-3xl font-black text-emerald-950 tracking-tight">Analysis Report</h3>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-emerald-600 tracking-tighter">{result.confidence}</div>
                  <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Confidence Score</div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="result-card bg-red-50 p-6 rounded-3xl border border-red-100 flex items-start gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Detected Issue</h4>
                  <p className="text-xl font-black text-red-950">{result.disease}</p>
                  <p className="text-red-800/60 text-sm mt-1 font-medium">Common fungal infection affecting leaves and stems.</p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="result-card flex-1">
                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Recommended Actions</h4>
                <div className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-50 hover:bg-emerald-50 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-emerald-900 font-medium text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="result-card pt-6 border-t border-emerald-50 text-center">
                <p className="text-[10px] text-emerald-900/30 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <ShieldCheck size={12} /> AI Diagnosis • Verify with a specialist
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AIAdvisor;
