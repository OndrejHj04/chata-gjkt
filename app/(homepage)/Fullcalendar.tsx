"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import csLocale from "@fullcalendar/core/locales/cs"
import { Paper, Button, ButtonGroup, Typography, Tooltip, List, ListItem, ListItemText, Checkbox, } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { NavigateBefore, NavigateNext } from "@mui/icons-material"

import dayjs from 'dayjs'
import { setBlockedDates } from '@/lib/api'
import { Room, RoomId } from '@/constants/room'

export default function FullcalendarComponent({ data, role }: { data: any, role: any }) {
  const searchParams = useSearchParams()
  const { replace } = useRouter();
  const pathname = usePathname()
  
  const [selectedDays, setSelectedDays] = useState<any>([])

  const calendarEventData = data.data.map((event: any) => ({
    id: event.id,
    title: event.name,
    start: event.from_date,
    end: dayjs(event.to_date).add(1, "day").format("YYYY-MM-DD"),
    rooms: event.rooms,
    leader: event.leader,
    color: event.status.color,
    icon: event.status.icon,
    display_name: event.status.display_name,
    ...(event.status.id !== 5 && { url: `/reservation/detail/${event.id}/info` })
  }))

  const calendarRef = useRef(null)
  const { refresh } = useRouter()
  const [calendarTitle, setCalendarTitle] = useState("")

  useEffect(() => {
    const calendarApi = (calendarRef.current as any).getApi()
    setCalendarTitle(calendarApi.currentData.viewTitle)
  }, [])

  const mutateCalendar = (action: "next" | "prev" | "today") => {
    const calendarApi = (calendarRef.current as any).getApi()
    switch (action) {
      case "next":
        calendarApi.next()
        break
      case "prev":
        calendarApi.prev()
        break;
      case "today":
        calendarApi.today()
    }
    setCalendarTitle(calendarApi.currentData.viewTitle)
  }

  const eventContentInjection = (event: any) => {
    const { leader, rooms, display_name } = event.event.extendedProps

    return <Tooltip title={<List className='p-0'>
      <ListItem className="!p-0">
        <ListItemText>Název: {event.event.title}</ListItemText>
      </ListItem>
      <ListItem className="!p-0">
        <ListItemText>Pokoje: {rooms.map((item: any) => item.id).join(",")}</ListItemText>
      </ListItem>
      <ListItem className='!p-0'>
        <ListItemText>Vedoucí: {leader.first_name} {leader.last_name}</ListItemText>
      </ListItem>
      <ListItem className="!p-0">
        <ListItemText>Status: {display_name}</ListItemText>
      </ListItem>
    </List>}>
      <p>{event.event.title}</p>
    </Tooltip>
  }

  const handleBlocation = async () => {
    setBlockedDates({ from_date: selectedDays[0], to_date: dayjs(selectedDays[1]).subtract(1, "day").format("YYYY-MM-DD") })
    setSelectedDays([])
    refresh()
  }

  const handleFilterRoom = (roomId: RoomId) => {
    const params = new URLSearchParams(searchParams);

    if(searchParams.has(roomId)) params.delete(roomId)
    else params.set(roomId, "1")
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Paper className="flex w-full h-full sm:flex-row flex-col p-2">
      <div className='flex flex-col sm:mr-2 mb-2 gap-2'>
        <div className="flex sm:flex-col flex-row gap-2">
          <Typography variant="h6" className='!font-semibold text-center w-full'>
            {calendarTitle}
          </Typography>
          <ButtonGroup size="small" fullWidth>
            <Button onClick={() => mutateCalendar("prev")}>
              <NavigateBefore />
            </Button>
            <Button onClick={() => mutateCalendar("next")}>
              <NavigateNext />
            </Button>
          </ButtonGroup>
          <Button variant="outlined" size="small" onClick={() => mutateCalendar("today")}>Dnes</Button>
        </div>
        {Room.getAllRooms().map((room) => (
          <Button key={room.id} onClick={() => handleFilterRoom(room.id)} size='small'>
            <div className='normal-case text-white flex items-center'>
              <Typography>{room.name}</Typography>
              <Checkbox disableRipple checked={searchParams.get(room.id) === "1" ? true : false}/>
            </div>
          </Button>
        ))}
        {role === "admin" && <Tooltip title="Kliknutím nebo potažením mezi jednotlivými dny vyberete období k blokaci">
          <span>
            <Button variant='contained' fullWidth disabled={!selectedDays.length} onClick={handleBlocation} size="small">Blokovat</Button>
          </span>
        </Tooltip>
        }</div>
      <div className='flex-1' style={{ minHeight: 450 }}>
        <FullCalendar selectable={role === 'admin'} ref={calendarRef} height="100%" locale={csLocale} headerToolbar={{ right: "", left: "" }} plugins={[dayGridPlugin, interactionPlugin]} initialView="dayGridMonth" events={calendarEventData} eventContent={eventContentInjection} select={(date) => setSelectedDays([date.start, date.end])} unselect={() => setSelectedDays([])} unselectCancel='.MuiButtonBase-root' defaultAllDay />
      </div>
    </Paper >
  )
}
