import {awaitedForEach, log} from '@augment-vir/common';
import {existsSync} from 'node:fs';
import {rm} from 'node:fs/promises';
import {homedir} from 'node:os';
import {join} from 'node:path';

type NetlifyStatusShowParams = {
    /** Optional. Default to the plugin’s name followed by a generic title. */
    title?: string;
    /** Required. */
    summary: string;
    /** Optional. Empty by default. */
    text?: string;
};

type NetlifyPluginArgs = {
    utils: {
        status: {
            show(params: NetlifyStatusShowParams): void;
        };
    };
};

const homeDirPath = homedir();
const cwd = process.cwd();

const cacheDirectories = [
    join(cwd, '.netlify', 'cache'),
    join(cwd, '.netlify', '.cache'),
    join('/', 'opt', 'build', 'cache'),
    join('/', 'opt', 'build', '.cache'),
    join('/', 'opt', 'buildhome', 'cache'),
    join('/', 'opt', 'buildhome', '.cache'),
    join(homeDirPath, '.npm'),
    join(homeDirPath, '.cache'),
];

async function removePath(path: string) {
    try {
        if (existsSync(path)) {
            await rm(path, {
                recursive: true,
                force: true,
            });

            log.faint(`Path removed: ${path}`);
        } else {
            log.faint(`Path does not exist: ${path}`);
        }
    } catch (error) {
        console.error(error);
        log.error(`Failed to remove path: ${path}`);
    }
}

async function removeAllCaches(utils: NetlifyPluginArgs['utils']): Promise<void> {
    await awaitedForEach(cacheDirectories, async (cacheDirPath) => await removePath(cacheDirPath));

    utils.status.show({
        summary: 'Cache directories purged.',
    });
}

export async function onPreBuild({utils}: NetlifyPluginArgs) {
    await removeAllCaches(utils);
}

export async function onPostBuild({utils}: NetlifyPluginArgs) {
    await removeAllCaches(utils);
}

export async function onSuccess({utils}: NetlifyPluginArgs) {
    await removeAllCaches(utils);
}

export async function onError({utils}: NetlifyPluginArgs) {
    await removeAllCaches(utils);
}
