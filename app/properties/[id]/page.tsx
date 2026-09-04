import { fetchPropertiesData } from "../../lib/data";
import PropertyDetailClient from "./PropertyDetailClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
    const properties = await fetchPropertiesData();
    return properties.map((p: any) => ({ id: String(p.id) }));
}

export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
    const properties = await fetchPropertiesData();
    const property = properties.find((p: any) => String(p.id) === params.id);

    if (!property) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
                <Link href="/properties" className="text-[var(--primary)] hover:underline">Back to Properties</Link>
            </div>
        );
    }

    return <PropertyDetailClient initialProperty={property} />;
}
