import { notFound } from "next/navigation";
import { getDocumentById } from "@/constants/documents";
import DocumentViewer from "@/components/marketing/document-viewer";

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
    const doc = getDocumentById(resolvedParams.doc);
    
    if (!doc) {
        return { title: "Document Not Found | Budget Ndio Story" };
    }

    return {
        title: `${doc.fullName} (${doc.title}) | Budget Ndio Story`,
        description: doc.description,
    };
}

const DocumentPage = async ({ params }: Props) => {
    const resolvedParams = await params;
    const doc = getDocumentById(resolvedParams.doc);

    if (!doc) {
        notFound();
    }

    return <DocumentViewer document={doc} />;
};

export default DocumentPage;