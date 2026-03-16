import { SnippetDetail } from "@/components/snippet/snippet-detail"

type Props = {
  params: Promise<{ slug: string }>
}

const SnippetPage = async ({ params }: Props) => {
  const { slug } = await params
  return <SnippetDetail slug={slug} />
}

export default SnippetPage
