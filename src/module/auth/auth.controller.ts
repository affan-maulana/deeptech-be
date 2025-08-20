import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { RegisterDto } from './dto/registerDto';
import { ResponseDefaultDto } from 'src/common/dto/response-default.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { result } = await this.authService.login(loginDto);

    res.cookie('token', result.token, {
      httpOnly: false,
      secure: false, // aktifkan di production
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000, // 2 jam
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });
    return { message: 'Login successful' };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const resp = await this.authService.register(registerDto);
    return new ResponseDefaultDto(resp);
  }


  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    return { message: 'Logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  @HttpCode(HttpStatus.OK)
  // @ApiDefaultResponses('Check login status')
  async me(@Req() req: any) {
    try {
      // JwtAuthGuard akan otomatis memvalidasi token dan inject user ke req.user
      const user = req.user;
      if (!user) {
        return { isLoggedIn: false, message: 'Not logged in' };
      }
      return { isLoggedIn: true, user };
    } catch (error) {
      return { isLoggedIn: false, message: 'Not logged in', error };
    }
  }
}
