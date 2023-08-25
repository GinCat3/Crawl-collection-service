import { Inject, Injectable } from '@nestjs/common';
import { BrowserContext } from 'puppeteer';
import { PuppeteerAction } from '../common/interfaces/puppeteer-action.interface';
import { InjectContext } from 'src/puppeteer/puppeteer.decorators';
import { SimulateResponse } from 'src/common/interfaces/puppeteer-simulate.interface';
import { TaskMessage } from 'src/common/interfaces/task-message.interface';
import * as fs from 'fs';

import { CollectionService } from '../collection/collection.service';
import { SyncStateStatus, SyncState } from 'src/collection/sync-state.entity';
import { CollectionToken } from '../collection/collection-token.entity';
import { Collection } from 'src/collection/collection.entity';
import { formatTime } from 'src/common/utils/time';

@Injectable()
export class PuppeteerService {
	@Inject()
	private collectionService: CollectionService;

	constructor(
		@InjectContext() private readonly browserContext: BrowserContext,
	) { }
	public async simulate(actions: PuppeteerAction[]): Promise<SimulateResponse> {
		const page = await this.browserContext.newPage();
		const response: SimulateResponse = { headers: {}, cookies: [] };
		const userAgent =
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
		page.setUserAgent(userAgent);
		await page.setRequestInterception(true);
		page.on('request', (request) => {
			const headers = request.headers();
			if (headers['Authorization'] || headers['authorization']) {
				console.log(
					`Matched ${headers['Authorization']}, ${headers['authorization']}`,
				);
				response.headers = headers;
			}
			request.continue();
		});
		for (const action of actions) {
			console.log(action);
			try {
				switch (action.type) {
					case 'goto':
						await page.goto(action.url);
						break;
					case 'wait_for_network_idle':
						await page.waitForNetworkIdle({
							idleTime: action.delay,
							timeout: action.timeout || 1500,
						});
						break;
					case 'wait_for_selector':
						await page.waitForSelector(action.selector, { visible: true });
						break;
					case 'type':
						await page.type(action.selector, action.value, {
							delay: action.delay,
						});
						break;
					case 'evaluate':
						await page.evaluate(action.function);
						break;
					case 'wait_for_response':
						const resp = await page.waitForResponse(action.url, {
							timeout: 5000,
						});
						if (resp) {
							response.headers = resp.request().headers();
						}
						break;
				}
			} catch (err) {
				console.log(err);
				// break;
			}
		}
		response.cookies = await page.cookies();
		await page.close();
		return response;
	}

	public async crawl(message: TaskMessage) {
		const page = await this.browserContext.newPage();
		const userAgent =
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
		page.setUserAgent(userAgent);
		const now = Date.now();
		const fileName = `${message.symbol}-${now}.json`;
		const output = fs.createWriteStream(fileName);

		console.log(`Crawl ${message.url}`);
		await page.goto(message.url);
		await page.waitForTimeout(3000);

		let offset = 0;
		const limit = 20;
		while (true) {
			try {
				const resp = await page.evaluate(
					async (args) => {
						const url = new URL(
							'https://api-mainnet.magiceden.io/v2/ord/btc/tokens',
						);
						const params = new URLSearchParams({
							limit: '20',
							offset: args.offset.toString(),
							sortBy: 'inscriptionNumberAsc',
							minPrice: '0',
							maxPrice: '0',
							collectionSymbol: args.symbol,
							disablePendingTransactions: 'true',
						});

						url.search = params.toString();
						console.log(`Fetch ${url.toString()}`);
						try {
							const resp = await fetch(url, {
								signal: AbortSignal.timeout(30000),
							});
							const data = await resp.json();
							const spiderData = {
								url: resp.url,
								status: resp.status,
								data,
								err: '',
								ok: true,
							};

							return spiderData;
						} catch (err) {
							const spiderData = {
								url: url,
								status: 400,
								data: {},
								err: err.toString(),
								ok: false,
							};
							return spiderData;
						}
					},
					{ offset, symbol: message.symbol },
				);
				if (resp) {
					const logMsg = `Fetch ${resp.url}, status: ${resp.status}, data.ok: ${resp.ok}`;
					console.log(logMsg);
					if (resp.ok) {
						output.write(JSON.stringify(resp) + '\n');
						if ((resp.data as any).tokens.length < 20) {
							break;
						}
					}
				}
			} catch (err) {
				console.error(err);
			} finally {
				offset += limit;
				await new Promise((resolve) => setTimeout(resolve, 1500));
			}
		}
	}

	async crawl1(message: TaskMessage) {
		const page = await this.browserContext.newPage();
		const userAgent =
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
		page.setUserAgent(userAgent);

		let offset = 0;
		const limit = 20;

		// 读取同步状态。
		let syncStatusResult = await this.collectionService.findSyncStateByCollectionSymbol(message.symbol);
		console.log('syncStatusResult', syncStatusResult);

		let collection = await this.collectionService.findCollectionBySymbol(message.symbol);

		// 如果同步状态是同步中，需要从上次失败的地方继续爬取
		if (collection) {
			let tokenCount = await this.collectionService.findTokenCountByCollectionId(collection.id)
			console.log('tokenCount', tokenCount);
			offset = Math.floor(tokenCount / 20) * 20;
		}

		await page.goto(message.url);
		await page.waitForTimeout(3000);

		while (true) {
			try {
				const resp = await page.evaluate(
					async (args) => {
						const url = new URL(
							'https://api-mainnet.magiceden.io/v2/ord/btc/tokens',
						);
						const params = new URLSearchParams({
							limit: '20',
							offset: args.offset.toString(),
							sortBy: 'inscriptionNumberAsc',
							minPrice: '0',
							maxPrice: '0',
							collectionSymbol: args.symbol,
							disablePendingTransactions: 'true',
						});

						url.search = params.toString();
						console.log(`Fetch ${url.toString()}`);
						try {
							const resp = await fetch(url, {
								signal: AbortSignal.timeout(30000),
							});
							const data = await resp.json();
							const spiderData = {
								url: resp.url,
								status: resp.status,
								data,
								err: '',
								ok: true,
							};

							return spiderData;
						} catch (err) {
							const spiderData = {
								url: url,
								status: 400,
								data: {},
								err: err.toString(),
								ok: false,
							};
							return spiderData;
						}
					},
					{ offset, symbol: message.symbol },
				);
				if (resp) {
					const logMsg = `Fetch ${resp.url}, status: ${resp.status}, data.ok: ${resp.ok}`;
					console.log(logMsg);
					if (resp.ok) {
						// 写入collection
						if (!syncStatusResult) {
							if (resp.data.tokens.length > 0 && !collection) {
								collection = await this.handleCollectionData(resp.data.tokens[0].collection);
							}
							console.log('collectionId', collection.id);
						}

						console.log('handleData start');
						await this.handleData(resp.data.tokens, collection.id);
						console.log('handleData end, -----------------------');

						// 写入同步状态
						console.log('handleSyncStateData start');
						const result = await this.handleSyncStateData({ collection, offset, err: '', syncId: syncStatusResult ? syncStatusResult.id : 0 });

						syncStatusResult = result || syncStatusResult;
						console.log('handleSyncStateData end, -----------------------');

						if ((resp.data as any).tokens.length < 20) {
							let saveValues = new SyncState();
							saveValues.id = syncStatusResult.id;
							saveValues.status = SyncStateStatus.DONE;
							saveValues.offsetNum = offset;
							syncStatusResult = await this.collectionService.saveSyncState(saveValues);
							break;
						}
					} else {
						if (collection) {
							console.log('resp.err', resp.err);
							this.handleSyncStateData({ collection, offset, err: resp.err, syncId: syncStatusResult.id });
						}
					}
				} else {
					if (collection) {
						console.log('resp is null');
						this.handleSyncStateData({ collection, offset, err: 'resp is null', syncId: syncStatusResult.id });
					}
				}
			} catch (err) {
				if (collection) {
					console.log('get.err', err);
					this.handleSyncStateData({ collection, offset, err:  err, syncId: syncStatusResult.id });
				}
				
			} finally {
				offset += limit;
				await new Promise((resolve) => setTimeout(resolve, 1500));
			}
		}

		await page.close();
		console.log('########################################### page closed');
	}

	async handleData(tokens: any[], collectionId: number) {
		for (const token of tokens) {
			
			let name = token?.meta?.name || '';
			name = name.replaceAll("'", "''");
			const inscriptionId = token['id'];
			const meInscriptionNumber = token['inscriptionNumber'];
			const genesisTransactionHash = token['genesisTransactionBlockHash'];
			const genesisBlockHash = token['genesisTransactionBlockHash'];

			const genesisBlockTime = formatTime(token['genesisTransactionBlockTime']);

			const genesisBlockHeight = token['genesisTransactionBlockHeight'];
			const owner = token['owner'];
			const sat = token['sat'];
			const satRarity = token['satRarity'];
			const satBlockHeight = token['satBlockHeight'];

			const satBlockTime = formatTime(token['satBlockTime']);

			let tokenValues = new CollectionToken();

			const _tokenValues = {
				collectionId,
				name,
				inscriptionId,
				meInscriptionNumber,
				genesisTransactionHash,
				genesisBlockHash,
				genesisBlockTime,
				genesisBlockHeight,
				owner,
				sat,
				satRarity,
				satBlockHeight,
				satBlockTime,
			};

			tokenValues = Object.assign(tokenValues, _tokenValues);

			const findToken = await this.collectionService.findCollectionTokenByInscriptionId(token['id']);
			if (findToken) {
				await this.collectionService.updateCollectionToken(findToken.id, tokenValues);
			}
			
			await this.collectionService.saveCollectionToken(tokenValues);
		}
	}
	async handleCollectionData(collection: any) {
		let collectionValues = new Collection();
		const _collectionValues = {
			collectionSymbol: collection['symbol'],
			collectionName: collection['name'].replaceAll("'", "''"),
			collectionDesc: collection['description'].replaceAll("'", "''"),
			totalSupply: collection['supply'] ? collection['supply'] : 0,
			coverImg: collection['imageURI'],
		};
		collectionValues = Object.assign(collectionValues, _collectionValues);
		return await this.collectionService.saveCollection(collectionValues);
	}
	async handleSyncStateData({ collection, offset, err, syncId }: { collection: any, offset: number, err: string, syncId: number }) { 
		let saveValues = new SyncState();
		saveValues.collectionId = collection.id;
		saveValues.collectionSymbol = collection.collectionSymbol;
		saveValues.status = err ? SyncStateStatus.ERROR : SyncStateStatus.ONGOING;
		saveValues.errorMessage = err ? err : '';
		saveValues.offsetNum = offset;
		if (syncId) {
			await this.collectionService.updateSyncState(syncId, saveValues);
			return
		};

		return await this.collectionService.saveSyncState(saveValues);
	}
}

