import DocumentViewer from "@/components/marketing/document-viewer";
import { fetchDocumentsFromAPI, getDocumentById } from "@/constants/documents";
import { metaDescription } from "@/utils/metadata";
import Link from "next/link";

interface Props {
  params: Promise<{
    doc: string;
  }>;
}

export async function generateStaticParams() {
  const { getAllDocumentIds } = await import("@/constants/documents");
  const ids = getAllDocumentIds();
  return ids.map((id) => ({ doc: id }));
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  // Get basic document info for metadata (no API call needed)
  const doc = getDocumentById(resolvedParams.doc);

  if (!doc) {
    return { title: "Document Not Available | Budget Ndio Story" };
  }

  return {
    title: `${doc.fullName} (${doc.title}) | Budget Ndio Story`,
    description: metaDescription(
      doc.description,
      `Browse ${doc.fullName} documents and budget files on Budget Ndio Story.`,
    ),
  };
}

function DocumentError({ title, message }: { title: string; message: string }) {
  return (
    <section className="relative w-full min-h-screen bg-background overflow-hidden flex items-center justify-center py-20 px-4">
      <div className="max-w-xl text-center bg-white/5 border border-white/10 rounded-3xl p-10 shadow-xl shadow-black/5">
        <p className="text-sm uppercase tracking-[0.3em] text-primary/80 mb-4">
          Repository unavailable
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h1>
        <p className="text-base text-foreground/70 mb-8">{message}</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link
            href="/learn"
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          >
            Back to Learn Hub
          </Link>
        </div>
      </div>
    </section>
  );
}

const DocumentPage = async ({ params }: Props) => {
  const resolvedParams = await params;
  const docId = resolvedParams.doc;

  const result = await fetchDocumentsFromAPI();
  const { documents, error } = result;

  if (error) {
    return (
      <DocumentError
        title="Service temporarily unavailable"
        message="The document repository is busy right now. Please try again later."
      />
    );
  }

  const document = documents.find((doc) => doc.id === docId.toLowerCase());

  if (!document) {
    return (
      <DocumentError
        title="Document not available"
        message="This document is not currently available. Please return to the learn hub and try another resource."
      />
    );
  }

  return <DocumentViewer document={document} />;
};

export default DocumentPage;
