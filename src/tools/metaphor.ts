import { z } from 'zod'

import { MetaphorClient } from '../services/metaphor'
import { BaseTaskCallBuilder } from '../task'

export const MetaphorSearchToolInputSchema = z.object({
  query: z.string(),
  numResults: z.number().optional()
})

export type MetaphorSearchToolInput = z.infer<
  typeof MetaphorSearchToolInputSchema
>

export const MetaphorSearchToolOutputSchema = z.object({
  results: z.array(
    z.object({
      author: z.string().optional(),
      dateCreated: z.string().optional(),
      score: z.number(),
      title: z.string(),
      url: z.string()
    })
  )
})

export type MetaphorSearchToolOutput = z.infer<
  typeof MetaphorSearchToolOutputSchema
>

export class MetaphorSearchTool extends BaseTaskCallBuilder<
  typeof MetaphorSearchToolInputSchema,
  typeof MetaphorSearchToolOutputSchema
> {
  _metaphorClient: MetaphorClient

  constructor({
    metaphorClient = new MetaphorClient()
  }: {
    metaphorClient?: MetaphorClient
  } = {}) {
    super({
      inputSchema: MetaphorSearchToolInputSchema,
      outputSchema: MetaphorSearchToolOutputSchema
    })

    this._metaphorClient = metaphorClient
  }

  override async call(
    input: MetaphorSearchToolInput
  ): Promise<MetaphorSearchToolOutput> {
    // TODO: handle errors gracefully
    input = this._inputSchema.parse(input)

    return this._metaphorClient.search({
      query: input.query,
      numResults: input.numResults
    })
  }
}
