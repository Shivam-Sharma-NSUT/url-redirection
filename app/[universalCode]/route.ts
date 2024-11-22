import { find, isEmpty } from "lodash";
import originalLink, { OriginalLink } from "../models/originalLink";
import universalLink from "../models/universalLink";
import dbConnect from "@/lib/dbConnect";
import axios from "axios";

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

const getLink = async (ip: string, links: OriginalLink[], universalCode: string): Promise<string> => {
    const { data: { continentCode, countryCode, region } }: { data: IPData } = await axios.get(`http://ip-api.com/json/${ip}?fields=${FIELD_REQUIRED}`);
    console.log(continentCode, countryCode, region);

    const rightLinkByRegion = find(links, link => region == link?.city)?.originalLink;
    console.log('calling city', rightLinkByRegion);
    if (!isEmpty(rightLinkByRegion)) return rightLinkByRegion as string;
    
    const rightLinkByCountry = find(links, link => countryCode == link?.country)?.originalLink;
    console.log('calling country', rightLinkByCountry);
    if (!isEmpty(rightLinkByCountry)) return rightLinkByCountry as string;
    
    // const rightLinkByContinent = find(links, link => continentCode == link?.continent)?.originalLink;
    // console.log('calling continent', rightLinkByContinent);
    // if (!isEmpty(rightLinkByContinent)) return rightLinkByContinent as string;
    
    console.log('calling default', 'default');
    return `${process.env.DEFAULT_ALL_LINKS_PAGE_LINK}${universalCode}`;
};

export async function GET(request: Request, { params }: { params: Promise<{ universalCode: string }> }, ) {
    dbConnect();
    const { universalCode } = await params;
    console.log(request.headers.get('x-real-ip'));
    const ip = request.headers.get("x-real-ip");
    if (isEmpty(ip)) return Response.redirect(`${process.env.DEFAULT_ALL_LINKS_PAGE_LINK}${universalCode}`);

    console.log(ip, 'test');
    const isPresent = await universalLink.exists({ shortCode: universalCode, isDeleted: false });
    if (!isPresent) return Response.redirect(process.env.DEfAULT_AUTHOR_PAGE as string);

    const links: OriginalLink[] = await originalLink.find({ universalLink: universalCode });
    if (isEmpty(links)) return Response.redirect(process.env.DEFAULT_AUTHOR_PAGE as string);

    try {
        const link = await getLink(ip as string, links, universalCode);
        return Response.redirect(link);
    } catch (error) {
        console.log(error);
        return Response.redirect(process.env.DEFAULT_AUTHOR_PAGE as string);
    }
};
