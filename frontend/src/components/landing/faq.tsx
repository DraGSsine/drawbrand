import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Is logoMagic AI free to use?",
      answer: "LogoMagic offers a free tier with limited features to help you get started. For more advanced capabilities and commercial use, we offer affordable paid plans."
    },
    {
      question: "What types of images can I upload?",
      answer: "You can upload photos, sketches, illustrations, or any image file in JPG, PNG, or SVG formats. For best results, use clear images with good contrast and minimal background noise."
    },
    {
      question: "Will the AI exactly copy my uploaded photo?",
      answer: "No, the AI transforms your uploaded image into a logo design while preserving key elements and style. It creates a unique logo inspired by your image, not an exact copy."
    },
    {
      question: "Can I revise the logo after it's generated?",
      answer: "Yes! You can generate multiple variations of your logo, and with paid plans, you can fine-tune specific elements like colors, fonts, and layout."
    },
    {
      question: "Will the AI include the background of my image in the logo?",
      answer: "By default, the AI removes backgrounds and focuses on the main subject of your image to create a clean logo. You can specify if you want certain background elements preserved."
    },
    {
      question: "Can I generate a logo from a sketch or hand-drawn art?",
      answer: "Absolutely! Our AI excels at transforming sketches and hand-drawn art into polished logos. This is actually one of the most popular uses of our platform."
    },
    {
      question: "How long does it take to generate a logo from photo?",
      answer: "Most logos are generated within 10-30 seconds, depending on the complexity of your image and current system load. Premium plans receive priority processing."
    },
    {
      question: "Can I edit the logo after it's generated?",
      answer: "Yes, with our Pro and Enterprise plans, you can make adjustments to your generated logo using our built-in editor. You can also download the SVG format to make edits in any vector editing software."
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          <h2 className="text-4xl font-extrabold mb-6">
            Frequently Asked <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Find answers to common questions about our AI logo generator.
          </p>
        </div>

        <div className="max-w-3xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-300 dark:border-gray-700 last:border-0">
                <AccordionTrigger className="text-left text-lg font-medium py-4 text-gray-800 dark:text-gray-200">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;