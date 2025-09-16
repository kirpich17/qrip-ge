// "use client";

// import React, { useEffect, useState } from "react";
// import { useTranslation } from "@/hooks/useTranslate";

// const LANGS = [
//   { key: "en", label: "English" },
//   { key: "ru", label: "Русский" },
//   { key: "ka", label: "ქართული" },
// ];
// const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;
// export default function TermsConditionsPage() {
//   const { t } = useTranslation();

//    const termsPage = t("TermsPage");
  
//   const [active, setActive] = useState("en");
//   const [data, setData] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState("");
//   const [previewMode, setPreviewMode] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(API_BASE_URL + "api/terms/", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       console.log("🚀 ~ fetchData ~ response:", response)

//       if (response.ok) {
//         const result = await response.json();
//         setData(result);
//       } else {
//         console.error("Failed to fetch data");
//         setMessage("Failed to load data from server");
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setMessage("Error loading data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (
//     lang,
//     sectionId,
//     field,
//     value,
//     isNote = false,
//     isListItem = false,
//     itemIndex = null
//   ) => {
//     setData((prev) => {
//       if (isNote) {
//         // Update note content
//         return {
//           ...prev,
//           [lang]: {
//             ...prev[lang],
//             note: {
//               ...prev[lang].note,
//               [field]: value,
//             },
//           },
//         };
//       } else if (isListItem && itemIndex !== null) {
//         // Update list item
//         return {
//           ...prev,
//           [lang]: {
//             ...prev[lang],
//             sections: prev[lang].sections.map((section) =>
//               section.id === sectionId
//                 ? {
//                     ...section,
//                     items: section.items.map((item, idx) =>
//                       idx === itemIndex ? value : item
//                     ),
//                   }
//                 : section
//             ),
//           },
//         };
//       } else {
//         // Update section field
//         return {
//           ...prev,
//           [lang]: {
//             ...prev[lang],
//             sections: prev[lang].sections.map((section) =>
//               section.id === sectionId
//                 ? { ...section, [field]: value }
//                 : section
//             ),
//           },
//         };
//       }
//     });
//   };

//   const addNewListItem = (lang, sectionId) => {
//     setData((prev) => ({
//       ...prev,
//       [lang]: {
//         ...prev[lang],
//         sections: prev[lang].sections.map((section) =>
//           section.id === sectionId
//             ? { ...section, items: [...section.items, ""] }
//             : section
//         ),
//       },
//     }));
//   };

//   const removeListItem = (lang, sectionId, itemIndex) => {
//     setData((prev) => ({
//       ...prev,
//       [lang]: {
//         ...prev[lang],
//         sections: prev[lang].sections.map((section) =>
//           section.id === sectionId
//             ? {
//                 ...section,
//                 items: section.items.filter((_, idx) => idx !== itemIndex),
//               }
//             : section
//         ),
//       },
//     }));
//   };

//   const moveListItem = (lang, sectionId, itemIndex, direction) => {
//     setData((prev) => {
//       const sections = [...prev[lang].sections];
//       const sectionIndex = sections.findIndex((s) => s.id === sectionId);
//       const items = [...sections[sectionIndex].items];

//       if (
//         (direction === "up" && itemIndex === 0) ||
//         (direction === "down" && itemIndex === items.length - 1)
//       ) {
//         return prev;
//       }

//       const newIndex = direction === "up" ? itemIndex - 1 : itemIndex + 1;
//       [items[itemIndex], items[newIndex]] = [items[newIndex], items[itemIndex]];

//       sections[sectionIndex] = {
//         ...sections[sectionIndex],
//         items,
//       };

//       return {
//         ...prev,
//         [lang]: {
//           ...prev[lang],
//           sections,
//         },
//       };
//     });
//   };

//   const moveSection = (lang, sectionId, direction) => {
//     setData((prev) => {
//       const sections = [...prev[lang].sections];
//       const index = sections.findIndex((s) => s.id === sectionId);

//       if (
//         (direction === "up" && index === 0) ||
//         (direction === "down" && index === sections.length - 1)
//       ) {
//         return prev;
//       }

//       const newIndex = direction === "up" ? index - 1 : index + 1;
//       [sections[index], sections[newIndex]] = [
//         sections[newIndex],
//         sections[index],
//       ];

//       return {
//         ...prev,
//         [lang]: {
//           ...prev[lang],
//           sections,
//         },
//       };
//     });
//   };

//   // NEW: Function to add a new section
//   const addNewSection = (lang) => {
//     setData((prev) => {
//       const newSection = {
//         id: `section-${Date.now()}`,
//         title: "",
//         type: "text",
//         content: "",
//         intro: "",
//         items: [],
//       };

//       return {
//         ...prev,
//         [lang]: {
//           ...prev[lang],
//           sections: [...prev[lang].sections, newSection],
//         },
//       };
//     });
//   };

//   // NEW: Function to remove a section
//   const removeSection = (lang, sectionId) => {
//     if (!confirm("Are you sure you want to delete this section?")) return;

//     setData((prev) => ({
//       ...prev,
//       [lang]: {
//         ...prev[lang],
//         sections: prev[lang].sections.filter(
//           (section) => section.id !== sectionId
//         ),
//       },
//     }));
//   };

//   const saveToServer = async (payload) => {
//     try {
//       const response = await fetch(API_BASE_URL + `/terms/${data._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to save data");
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Error saving data:", error);
//       throw error;
//     }
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     // Validate all sections for the active language
//     const hasEmptyTitles = data[active].sections.some(
//       (section) => !section.title.trim()
//     );
//     const hasEmptyContent = data[active].sections.some((section) =>
//       section.type === "text"
//         ? !section.content.trim()
//         : section.items.some((item) => !item.trim())
//     );

//     if (hasEmptyTitles || hasEmptyContent) {
//       setMessage("Please fill in all required fields.");
//       return;
//     }

//     try {
//       setSaving(true);

//       // Prepare payload with only the active language data
//       const payload = {
//         [active]: {
//           lastUpdated: new Date().toISOString().split("T")[0],
//           note: data[active].note,
//           sections: data[active].sections.map(({ _id, ...rest }) => rest),
//         },
//       };

//       await saveToServer(payload);

//       setMessage("Saved successfully!");
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       setMessage("Save failed. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleReset = () => {
//     if (!confirm("Are you sure you want to reset all content to default?"))
//       return;
//     fetchData();
//     setMessage("Content has been reset.");
//     setTimeout(() => setMessage(""), 2500);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
//       </div>
//     );
//   }

//   if (!data) {
//     return <div className="p-6 bg-white rounded-lg shadow-sm"></div>;
//   }

//   return (
//     <>
//       <h1 className="text-[22px] font-medium text-black mb-9">
//         {termsPage.heading}
//       </h1>
//       <div className="max-w-6xl lg:p-6 p-3 bg-white rounded-lg shadow-sm">
//         {/* Language Tabs */}
//         <div className="flex flex-wrap gap-2 mb-6">
//           {LANGS.map((lng) => (
//             <button
//               key={lng.key}
//               onClick={() => setActive(lng.key)}
//               className={`flex items-center px-4 py-2.5 rounded-lg font-semibold lg:text-base text-sm border transition-all
//               ${
//                 active === lng.key
//                   ? "bg-[#E53935] text-white border-[#E53935] shadow-md hover:bg-red-600"
//                   : "bg-white text-gray-700 border-gray-200 hover:bg-[#fef2f2]"
//               }`}
//               aria-pressed={active === lng.key}
//             >
//               {lng.label}
//             </button>
//           ))}

//           <button
//             onClick={() => setPreviewMode(!previewMode)}
//             className={`md:ml-auto px-4 py-2.5 rounded-lg font-medium lg:text-base text-sm border transition-all
//             ${
//               previewMode
//                 ? "bg-gray-700 text-white border-gray-700"
//                 : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
//             }`}
//           >
//             {previewMode ? termsPage.ExitPreview : termsPage.Preview}
//           </button>
//         </div>

//         {/* Note Section */}
//         {!previewMode && (
//           <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-yellow-50">
//             <h3 className="text-lg font-semibold mb-2">
//               {termsPage.NoteSection}
//             </h3>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2 text-gray-700">
//                 {termsPage.NoteTitle}
//               </label>
//               <input
//                 type="text"
//                 value={data[active].note.title}
//                 onChange={(e) =>
//                   handleChange(active, null, "title", e.target.value, true)
//                 }
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300"
//                 placeholder="Enter note title"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2 text-gray-700">
//                 {termsPage.NoteContent}
//               </label>
//               <textarea
//                 rows={3}
//                 value={data[active].note.content}
//                 onChange={(e) =>
//                   handleChange(active, null, "content", e.target.value, true)
//                 }
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300"
//                 placeholder="Enter note content..."
//               />
//             </div>
//           </div>
//         )}

//         {/* NEW: Add Section Button */}
//         {!previewMode && (
//           <div className="mb-6 flex justify-between items-center">
//             <h3 className="text-lg font-semibold">
//               {" "}
//               {termsPage.Sections}
//             </h3>
//             <button
//               type="button"
//               onClick={() => addNewSection(active)}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               + {termsPage.AddSections}
//             </button>
//           </div>
//         )}

//         {/* Preview Mode */}
//         {previewMode ? (
//           <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
//               {/* {LANGS.find((l) => l.key === active)?.label}{" "} */}
//               {termsPage.TermsConditions}
//             </h2>

//             {/* Note Preview */}
//             <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
//               <h3 className="font-semibold">{data[active].note.title}</h3>
//               <p className="mt-2">{data[active].note.content}</p>
//             </div>

//             {/* Sections Preview */}
//             {data[active].sections.map((section) => (
//               <div key={section.id} className="mb-6">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                   {section.title}
//                 </h3>
//                 {section.intro && (
//                   <p className="mb-3 italic">{section.intro}</p>
//                 )}
//                 {section.type === "text" ? (
//                   <div className="prose max-w-none text-gray-700">
//                     {section.content.split("\n").map((paragraph, idx) => (
//                       <p key={idx}>{paragraph}</p>
//                     ))}
//                   </div>
//                 ) : (
//                   <ul className="list-disc pl-5 text-gray-700">
//                     {section.items.map((item, idx) => (
//                       <li key={idx} className="mb-2">
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <form onSubmit={handleSave} className="mt-6">
//             {data[active].sections.map((section, index) => (
//               <div
//                 key={section.id}
//                 className="mb-8 p-5 border border-gray-200 rounded-lg bg-gray-50 relative"
//               >
//                 {/* Section Controls */}
//                 <div className="absolute top-3 right-3 flex space-x-2">
//                   <button
//                     type="button"
//                     onClick={() => moveSection(active, section.id, "up")}
//                     disabled={index === 0}
//                     className={`p-1 rounded ${
//                       index === 0
//                         ? "text-gray-400"
//                         : "text-gray-600 hover:bg-gray-200"
//                     }`}
//                     title="Move up"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => moveSection(active, section.id, "down")}
//                     disabled={index === data[active].sections.length - 1}
//                     className={`p-1 rounded ${
//                       index === data[active].sections.length - 1
//                         ? "text-gray-400"
//                         : "text-gray-600 hover:bg-gray-200"
//                     }`}
//                     title="Move down"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </button>
//                   {/* NEW: Delete Section Button */}
//                   <button
//                     type="button"
//                     onClick={() => removeSection(active, section.id)}
//                     className="p-1 rounded text-red-600 hover:bg-red-100"
//                     title="Delete section"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </button>
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-2 text-gray-700">
//                     {termsPage.SectionTitle}
//                   </label>
//                   <input
//                     type="text"
//                     value={section.title}
//                     onChange={(e) =>
//                       handleChange(active, section.id, "title", e.target.value)
//                     }
//                     className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300"
//                     placeholder={termsPage.EnterTitle}
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-2 text-gray-700">
//                     {termsPage.SectionType}
//                   </label>
//                   <select
//                     value={section.type}
//                     onChange={(e) =>
//                       handleChange(active, section.id, "type", e.target.value)
//                     }
//                     className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300"
//                   >
//                     <option value="text"> {termsPage.Text}</option>
//                     <option value="list"> {termsPage.List}</option>
//                   </select>
//                 </div>

//                 {section.type === "text" ? (
//                   <div className="mb-4">
//                     <div className="flex justify-between items-center mb-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         {termsPage.Content")}
//                       </label>
//                       <span className="text-xs text-gray-500">
//                         {section.content.length} {termsPage.characters}
//                       </span>
//                     </div>
//                     <textarea
//                       rows={6}
//                       value={section.content}
//                       onChange={(e) =>
//                         handleChange(
//                           active,
//                           section.id,
//                           "content",
//                           e.target.value
//                         )
//                       }
//                       className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300"
//                       placeholder={termsPage.Entercontent}
//                     />
//                   </div>
//                 ) : (
//                   <>
//                     <div className="mb-4">
//                       <label className="block text-sm font-medium mb-2 text-gray-700">
//                         {termsPage.Introduction}
//                       </label>
//                       <input
//                         type="text"
//                         value={section.intro || ""}
//                         onChange={(e) =>
//                           handleChange(
//                             active,
//                             section.id,
//                             "intro",
//                             e.target.value
//                           )
//                         }
//                         className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300"
//                         placeholder={termsPage.EnterIntroduction}
//                       />
//                     </div>

//                     <div className="mb-4">
//                       <div className="flex justify-between items-center mb-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                           {termsPage.ListItems}
//                         </label>
//                         <button
//                           type="button"
//                           onClick={() => addNewListItem(active, section.id)}
//                           className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg"
//                         >
//                           {termsPage.AddItam}
//                         </button>
//                       </div>

//                       {section.items.map((item, itemIndex) => (
//                         <div
//                           key={itemIndex}
//                           className="flex items-center mb-2 relative group"
//                         >
//                           <input
//                             type="text"
//                             value={item}
//                             onChange={(e) =>
//                               handleChange(
//                                 active,
//                                 section.id,
//                                 "items",
//                                 e.target.value,
//                                 false,
//                                 true,
//                                 itemIndex
//                               )
//                             }
//                             className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-red-300"
//                             placeholder={termsPage.EnterListItem}
//                           />
//                           <div className="absolute right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 moveListItem(
//                                   active,
//                                   section.id,
//                                   itemIndex,
//                                   "up"
//                                 )
//                               }
//                               disabled={itemIndex === 0}
//                               className={`p-1 rounded ${
//                                 itemIndex === 0
//                                   ? "text-gray-400"
//                                   : "text-gray-600 hover:bg-gray-200"
//                               }`}
//                               title="Move up"
//                             >
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 className="h-4 w-4"
//                                 viewBox="0 0 20 20"
//                                 fill="currentColor"
//                               >
//                                 <path
//                                   fillRule="evenodd"
//                                   d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
//                                   clipRule="evenodd"
//                                 />
//                               </svg>
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 moveListItem(
//                                   active,
//                                   section.id,
//                                   itemIndex,
//                                   "down"
//                                 )
//                               }
//                               disabled={itemIndex === section.items.length - 1}
//                               className={`p-1 rounded ${
//                                 itemIndex === section.items.length - 1
//                                   ? "text-gray-400"
//                                   : "text-gray-600 hover:bg-gray-200"
//                               }`}
//                               title="Move down"
//                             >
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 className="h-4 w-4"
//                                 viewBox="0 0 20 20"
//                                 fill="currentColor"
//                               >
//                                 <path
//                                   fillRule="evenodd"
//                                   d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                                   clipRule="evenodd"
//                                 />
//                               </svg>
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 removeListItem(active, section.id, itemIndex)
//                               }
//                               className="p-1 rounded text-red-600 hover:bg-red-100"
//                               title="Remove item"
//                             >
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 className="h-4 w-4"
//                                 viewBox="0 0 20 20"
//                                 fill="currentColor"
//                               >
//                                 <path
//                                   fillRule="evenodd"
//                                   d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
//                                   clipRule="evenodd"
//                                 />
//                               </svg>
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}

//             <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="flex items-center px-5 py-2.5 rounded-lg bg-[#e53935] text-white font-medium hover:bg-red-600 disabled:opacity-70 transition-colors"
//               >
//                 {saving ? (
//                   <>
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     {termsPage.Saving}...
//                   </>
//                 ) : (
//                   `${termsPage.Save} ${
//                     LANGS.find((l) => l.key === active).label
//                   }`
//                 )}
//               </button>

//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 {termsPage.ResetAll")}
//               </button>

//               {message && (
//                 <span
//                   className={`text-sm font-medium ml-2 ${
//                     message.includes("success")
//                       ? "text-green-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {message}
//                 </span>
//               )}
//             </div>
//           </form>
//         )}
//       </div>
//     </>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslate";
import Link from "next/link";
import { ArrowLeft, Crown } from "lucide-react";
import LanguageDropdown from "@/components/languageDropdown/page";

const LANGS = [
  { key: "en", label: "English" },
  { key: "ru", label: "Русский" },
  { key: "ka", label: "ქართული" },
];
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;
export default function TermsConditionsPage() {
  const { t } = useTranslation();

   const termsPage = t("TermsPage");

     const translations = t("adminSubscriptionPage");
  
  const [active, setActive] = useState("en");
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL + "api/terms/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error("Failed to fetch data");
        setMessage("Failed to load data from server");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setMessage("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    lang,
    sectionId,
    field,
    value,
    isNote = false,
    isListItem = false,
    itemIndex = null
  ) => {
    setData((prev) => {
      if (isNote) {
        // Update note content
        return {
          ...prev,
          [lang]: {
            ...prev[lang],
            note: {
              ...prev[lang].note,
              [field]: value,
            },
          },
        };
      } else if (isListItem && itemIndex !== null) {
        // Update list item
        return {
          ...prev,
          [lang]: {
            ...prev[lang],
            sections: prev[lang].sections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    items: section.items.map((item, idx) =>
                      idx === itemIndex ? value : item
                    ),
                  }
                : section
            ),
          },
        };
      } else {
        // Update section field
        return {
          ...prev,
          [lang]: {
            ...prev[lang],
            sections: prev[lang].sections.map((section) =>
              section.id === sectionId
                ? { ...section, [field]: value }
                : section
            ),
          },
        };
      }
    });
  };

  const addNewListItem = (lang, sectionId) => {
    setData((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        sections: prev[lang].sections.map((section) =>
          section.id === sectionId
            ? { ...section, items: [...section.items, ""] }
            : section
        ),
      },
    }));
  };

  const removeListItem = (lang, sectionId, itemIndex) => {
    setData((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        sections: prev[lang].sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.filter((_, idx) => idx !== itemIndex),
              }
            : section
        ),
      },
    }));
  };

  const moveListItem = (lang, sectionId, itemIndex, direction) => {
    setData((prev) => {
      const sections = [...prev[lang].sections];
      const sectionIndex = sections.findIndex((s) => s.id === sectionId);
      const items = [...sections[sectionIndex].items];

      if (
        (direction === "up" && itemIndex === 0) ||
        (direction === "down" && itemIndex === items.length - 1)
      ) {
        return prev;
      }

      const newIndex = direction === "up" ? itemIndex - 1 : itemIndex + 1;
      [items[itemIndex], items[newIndex]] = [items[newIndex], items[itemIndex]];

      sections[sectionIndex] = {
        ...sections[sectionIndex],
        items,
      };

      return {
        ...prev,
        [lang]: {
          ...prev[lang],
          sections,
        },
      };
    });
  };

  const moveSection = (lang, sectionId, direction) => {
    setData((prev) => {
      const sections = [...prev[lang].sections];
      const index = sections.findIndex((s) => s.id === sectionId);

      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === sections.length - 1)
      ) {
        return prev;
      }

      const newIndex = direction === "up" ? index - 1 : index + 1;
      [sections[index], sections[newIndex]] = [
        sections[newIndex],
        sections[index],
      ];

      return {
        ...prev,
        [lang]: {
          ...prev[lang],
          sections,
        },
      };
    });
  };

  // NEW: Function to add a new section
  const addNewSection = (lang) => {
    setData((prev) => {
      const newSection = {
        id: `section-${Date.now()}`,
        title: "",
        type: "text",
        content: "",
        intro: "",
        items: [],
      };

      return {
        ...prev,
        [lang]: {
          ...prev[lang],
          sections: [...prev[lang].sections, newSection],
        },
      };
    });
  };

  // NEW: Function to remove a section
  const removeSection = (lang, sectionId) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    setData((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        sections: prev[lang].sections.filter(
          (section) => section.id !== sectionId
        ),
      },
    }));
  };

  const saveToServer = async (payload) => {
    try {
      const response = await fetch(API_BASE_URL + `api/terms/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validate all sections for the active language
    const hasEmptyTitles = data[active].sections.some(
      (section) => !section.title.trim()
    );
    const hasEmptyContent = data[active].sections.some((section) =>
      section.type === "text"
        ? !section.content.trim()
        : section.items.some((item) => !item.trim())
    );

    if (hasEmptyTitles || hasEmptyContent) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      // Prepare payload with only the active language data
      const payload = {
        [active]: {
          lastUpdated: new Date().toISOString().split("T")[0],
          note: data[active].note,
          sections: data[active].sections.map(({ _id, ...rest }) => rest),
        },
      };

      await saveToServer(payload);

      setMessage("Saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm("Are you sure you want to reset all content to default?"))
      return;
    fetchData();
    setMessage("Content has been reset.");
    setTimeout(() => setMessage(""), 2500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 bg-white rounded-lg shadow-sm"></div>;
  }

  return (
    <>
          <header className="bg-[#243b31] py-4 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <Link href="/admin/dashboard" className="flex items-center text-white hover:underline gap-2">
                <ArrowLeft size={20} /> {translations.header.back}
              </Link>
              <LanguageDropdown/>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
               {termsPage.manage}
              </h1>
            </div>
          </header>

      <h1 className="text-[22px] font-medium text-black mb-9">
        {termsPage.heading}
      </h1>

      <div className="max-w-6xl lg:p-6 p-3 bg-white rounded-lg shadow-sm">
        {/* Language Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {LANGS.map((lng) => (
            <button
              key={lng.key}
              onClick={() => setActive(lng.key)}
              className={`flex items-center px-4 py-2.5 rounded-lg font-semibold lg:text-base text-sm border transition-all
              ${
                active === lng.key
                  ? "bg-[#243b31] text-white border-[#243b31] shadow-md hover:bg-[#243b31]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-[#fef2f2]"
              }`}
              aria-pressed={active === lng.key}
            >
              {lng.label}
            </button>
          ))}

          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`md:ml-auto px-4 py-2.5 rounded-lg font-medium lg:text-base text-sm border transition-all
            ${
              previewMode
                ? "bg-gray-700 text-white border-gray-700"
                : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
            }`}
          >
            {previewMode ? termsPage.ExitPreview : termsPage.Preview}
          </button>
        </div>

        {/* Note Section */}
        {!previewMode && (
          <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-yellow-50">
            <h3 className="text-lg font-semibold mb-2">
              {termsPage.NoteSection}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                {termsPage.NoteTitle}
              </label>
              <input
                type="text"
                value={data[active].note.title}
                onChange={(e) =>
                  handleChange(active, null, "title", e.target.value, true)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder={termsPage.EnterTitle}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                {termsPage.NoteContent}
              </label>
              <textarea
                rows={3}
                value={data[active].note.content}
                onChange={(e) =>
                  handleChange(active, null, "content", e.target.value, true)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder={termsPage.Entercontent}
              />
            </div>
          </div>
        )}

        {/* NEW: Add Section Button */}
        {!previewMode && (
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {termsPage.Sections}
            </h3>
            <button
              type="button"
              onClick={() => addNewSection(active)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + {termsPage.AddSections}
            </button>
          </div>
        )}

        {/* Preview Mode */}
        {previewMode ? (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              {termsPage.TermsConditions}
            </h2>

            {/* Note Preview */}
            <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
              <h3 className="font-semibold">{data[active].note.title}</h3>
              <p className="mt-2">{data[active].note.content}</p>
            </div>

            {/* Sections Preview */}
            {data[active].sections.map((section) => (
              <div key={section.id} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {section.title}
                </h3>
                {section.intro && (
                  <p className="mb-3 italic">{section.intro}</p>
                )}
                {section.type === "text" ? (
                  <div className="prose max-w-none text-gray-700">
                    {section.content.split("\n").map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc pl-5 text-gray-700">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="mb-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-6">
            {data[active].sections.map((section, index) => (
              <div
                key={section.id}
                className="mb-8 p-5 border border-gray-200 rounded-lg bg-gray-50 relative"
              >
                {/* Section Controls */}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => moveSection(active, section.id, "up")}
                    disabled={index === 0}
                    className={`p-1 rounded ${
                      index === 0
                        ? "text-gray-400"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                    title="Move up"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(active, section.id, "down")}
                    disabled={index === data[active].sections.length - 1}
                    className={`p-1 rounded ${
                      index === data[active].sections.length - 1
                        ? "text-gray-400"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                    title="Move down"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {/* NEW: Delete Section Button */}
                  <button
                    type="button"
                    onClick={() => removeSection(active, section.id)}
                    className="p-1 rounded text-red-600 hover:bg-red-100"
                    title="Delete section"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    {termsPage.SectionTitle}
                  </label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      handleChange(active, section.id, "title", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300"
                    placeholder={termsPage.EnterTitle}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    {termsPage.SectionType}
                  </label>
                  <select
                    value={section.type}
                    onChange={(e) =>
                      handleChange(active, section.id, "type", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    <option value="text">{termsPage.Text}</option>
                    <option value="list">{termsPage.List}</option>
                  </select>
                </div>

                {section.type === "text" ? (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {termsPage.Content}
                      </label>
                      <span className="text-xs text-gray-500">
                        {section.content.length} {termsPage.characters}
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      value={section.content}
                      onChange={(e) =>
                        handleChange(
                          active,
                          section.id,
                          "content",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300"
                      placeholder={termsPage.Entercontent}
                    />
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        {termsPage.Introduction}
                      </label>
                      <input
                        type="text"
                        value={section.intro || ""}
                        onChange={(e) =>
                          handleChange(
                            active,
                            section.id,
                            "intro",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300"
                        placeholder={termsPage.EnterIntroduction}
                      />
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {termsPage.ListItems}
                        </label>
                        <button
                          type="button"
                          onClick={() => addNewListItem(active, section.id)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg"
                        >
                          {termsPage.AddItam}
                        </button>
                      </div>

                      {section.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center mb-2 relative group"
                        >
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              handleChange(
                                active,
                                section.id,
                                "items",
                                e.target.value,
                                false,
                                true,
                                itemIndex
                              )
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-red-300"
                            placeholder={termsPage.EnterListItem}
                          />
                          <div className="absolute right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() =>
                                moveListItem(
                                  active,
                                  section.id,
                                  itemIndex,
                                  "up"
                                )
                              }
                              disabled={itemIndex === 0}
                              className={`p-1 rounded ${
                                itemIndex === 0
                                  ? "text-gray-400"
                                  : "text-gray-600 hover:bg-gray-200"
                              }`}
                              title="Move up"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                moveListItem(
                                  active,
                                  section.id,
                                  itemIndex,
                                  "down"
                                )
                              }
                              disabled={itemIndex === section.items.length - 1}
                              className={`p-1 rounded ${
                                itemIndex === section.items.length - 1
                                  ? "text-gray-400"
                                  : "text-gray-600 hover:bg-gray-200"
                              }`}
                              title="Move down"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                removeListItem(active, section.id, itemIndex)
                              }
                              className="p-1 rounded text-red-600 hover:bg-red-100"
                              title="Remove item"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}

            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-5 py-2.5 rounded-lg bg-[#243b31] text-white font-medium hover:bg-[#243b31] disabled:opacity-70 transition-colors"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {termsPage.Saving}...
                  </>
                ) : (
                  `${termsPage.Save} ${
                    LANGS.find((l) => l.key === active).label
                  }`
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {termsPage.ResetAll}
              </button>

              {message && (
                <span
                  className={`text-sm font-medium ml-2 ${
                    message.includes("success")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </>
  );
}