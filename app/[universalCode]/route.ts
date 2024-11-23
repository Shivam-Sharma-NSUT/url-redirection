import { find, isEmpty } from "lodash";
import originalLink, { OriginalLink } from "../models/originalLink";
import universalLink from "../models/universalLink";
import dbConnect from "@/lib/dbConnect";
import axios from "axios";
import { log } from "../actions";

const FIELD_REQUIRED = 'status,continent,continentCode,country,countryCode,region,city,query';

interface IPData {
    status: string;
    continent: string;
    continentCode: string;
    country: string;
    countryCode: string;
    region: string;
    city: string;
    query: string;
};

const getLink = async (ip: string, links: OriginalLink[], universalCode: string, my_transaction_id: string): Promise<string> => {
    const { data: { continentCode, countryCode, region } }: { data: IPData } = await axios.get(`http://ip-api.com/json/${ip}?fields=${FIELD_REQUIRED}`);
    log({ my_transaction_id, ip, method: `/${universalCode}`, continentCode, countryCode, region });
    
    const rightLinkByRegion = find(links, link => region == link?.city)?.originalLink;
    if (!isEmpty(rightLinkByRegion)) return rightLinkByRegion as string;
    
    const rightLinkByCountry = find(links, link => countryCode == link?.country)?.originalLink;
    if (!isEmpty(rightLinkByCountry)) return rightLinkByCountry as string;
    
    // const rightLinkByContinent = find(links, link => continentCode == link?.continent)?.originalLink;
    // if (!isEmpty(rightLinkByContinent)) return rightLinkByContinent as string;
    
    log({ my_transaction_id, ip, method: `/${universalCode}`, message: 'no link matched' });
    return `${process.env.DEFAULT_ALL_LINKS_PAGE_LINK}${universalCode}`;
};

export async function GET(request: Request, { params }: { params: Promise<{ universalCode: string }> }, ) {
    dbConnect();
    const { universalCode } = await params;
    const ip = request.headers.get("x-real-ip");
    const my_transaction_id = request.headers.get('my_transaction_id') as string;
    log({ my_transaction_id, ip, method: `/${universalCode}` });
    if (isEmpty(ip)) return Response.redirect(`${process.env.DEFAULT_ALL_LINKS_PAGE_LINK}${universalCode}`);
    
    const isPresent = await universalLink.exists({ shortCode: universalCode, isDeleted: false });
    log({ my_transaction_id, ip, method: `/${universalCode}`, isPresent });
    if (!isPresent) return Response.redirect(process.env.DEfAULT_AUTHOR_PAGE as string);
    
    const links: OriginalLink[] = await originalLink.find({ universalLink: universalCode });
    log({ my_transaction_id, ip, method: `/${universalCode}`, links });
    if (isEmpty(links)) return Response.redirect(process.env.DEFAULT_AUTHOR_PAGE as string);
    
    try {
        const link = await getLink(ip as string, links, universalCode, my_transaction_id);
        log({ my_transaction_id, ip, method: `/${universalCode}`, finalLink: link });
        return Response.redirect(link);
    } catch (error) {
        log({ my_transaction_id, ip, method: `/${universalCode}`, error });
        return Response.redirect(process.env.DEFAULT_AUTHOR_PAGE as string);
    }
};
